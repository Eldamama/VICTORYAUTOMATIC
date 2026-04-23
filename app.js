// --- 1. CONFIGURATION ---
const SUPABASE_URL = "https://TON_PROJET.supabase.co";
const SUPABASE_KEY = "TA_CLE_ANON_ICI";
const MON_LIEN_RACINE = "tonIDparDefaut"; 
const LIEN_VIDEO_YOUTUBE = "https://youtube.com/watch?v=TON_CODE_ICI"; 

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- 2. NOTIFICATIONS ---
function showNotification(msg) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.innerText = msg;
        toast.style.display = 'block';
        setTimeout(() => toast.style.display = 'none', 3000);
    }
}

// --- 3. INSCRIPTION (AVEC VÉRIFICATION DU PARRAIN) ---
async function startYoutubeStep() {
    const userField = document.getElementById('username');
    const emailField = document.getElementById('email'); 
    const user = userField ? userField.value.trim() : "";
    const mail = emailField ? emailField.value.trim() : "";

    if (user.length < 3) {
        alert("Pseudo trop court.");
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const parrainID = urlParams.get('ref') || MON_LIEN_RACINE;

    showNotification("Vérification de la généalogie...");

    // VÉRIFICATION : Le parrain existe-t-il dans notre base ?
    if (parrainID !== MON_LIEN_RACINE) {
        const { data: parrainExiste } = await _supabase
            .from('users')
            .select('ref_code')
            .eq('ref_code', parrainID)
            .single();

        if (!parrainExiste) {
            alert("Erreur : Ce parrain n'est pas reconnu dans la généalogie officielle.");
            return;
        }
    }

    // INSCRIPTION TEMPORAIRE
    const { error } = await _supabase.from('users').insert([
        { 
            username: user, 
            email: mail, 
            referred_by: parrainID, 
            ref_code: "TEMP_" + Math.random().toString(36).substr(2, 5) 
        }
    ]);

    if (error) {
        alert("Erreur : " + error.message);
        return;
    }

    document.getElementById('step-registration').classList.add('hidden');
    document.getElementById('step-youtube').classList.remove('hidden');
}

// --- 4. CHRONO YOUTUBE (180s) ---
function handleYoutubeInteraction() {
    window.open(LIEN_VIDEO_YOUTUBE, "_blank");
    const btn = document.getElementById('btn-video');
    let timeLeft = 180;
    btn.disabled = true;
    const countdown = setInterval(() => {
        timeLeft--;
        btn.innerText = `Validation du soutien... ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(countdown);
            btn.innerText = "✅ SOUTIEN VALIDÉ";
            document.getElementById('step-victory').classList.remove('hidden');
        }
    }, 1000);
}

// --- 5. RÉCLAMER LE LIEN DU PARRAIN ---
function openVictory() {
    const urlParams = new URLSearchParams(window.location.search);
    const parrainURL = urlParams.get('ref') || MON_LIEN_RACINE;
    window.open(`https://victory-automatic.com/register/${parrainURL}`, "_blank");
    document.getElementById('final-setup').classList.remove('hidden');
}

// --- 6. EXTRACTION DU LIEN ET MISE À JOUR ---
async function activerMonLien() {
    const pseudoLocal = document.getElementById('username').value;
    const lienComplet = document.getElementById('victory-id-input').value.trim();

    if (!lienComplet) {
        alert("Veuillez coller votre lien Victory.");
        return;
    }

    // Extraction de l'ID (ex: https://.../register/mon-id -> mon-id)
    const parties = lienComplet.split('/');
    let victoryID = parties[parties.length - 1] || parties[parties.length - 2];
    
    // Sécurité au cas où le lien finit par un "/"
    if (!victoryID || victoryID.includes('http')) {
        victoryID = parties[parties.length - 1] === "" ? parties[parties.length - 2] : parties[parties.length - 1];
    }

    showNotification("Lien en cours d'activation...");

    const { error } = await _supabase
        .from('users')
        .update({ ref_code: victoryID })
        .eq('username', pseudoLocal);

    if (error) {
        alert("Erreur d'activation : " + error.message);
    } else {
        showNotification("Félicitations ! Votre système est activé.");
        document.getElementById('final-setup').classList.add('hidden');
        document.getElementById('step-share').classList.remove('hidden');
        document.getElementById('step-share').setAttribute('data-my-id', victoryID);
    }
}

// --- 7. PARTAGE ---
function shareVideo() {
    const vID = document.getElementById('step-share').getAttribute('data-my-id');
    const shareLink = `${window.location.origin}${window.location.pathname}?ref=${vID}`;
    if (navigator.share) {
        navigator.share({ title: "Victory Boost", text: "Rejoins-nous sur Victory !", url: shareLink });
    } else {
        alert("Lien : " + shareLink);
    }
}

// --- 8. TIMER 24H ---
let time = 86400;
setInterval(() => {
    if (time > 0) {
        let h = Math.floor(time / 3600);
        let m = Math.floor((time % 3600) / 60);
        let s = time % 60;
        const d = document.getElementById('countdown');
        if (d) d.innerHTML = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
        time--;
    }
}, 1000);
