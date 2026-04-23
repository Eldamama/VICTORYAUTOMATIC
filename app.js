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

// --- 3. INSCRIPTION (ÉTAPE 1) ---
async function startYoutubeStep() {
    const userField = document.getElementById('username');
    const emailField = document.getElementById('email'); 

    const user = userField ? userField.value.trim() : "";
    const mail = emailField ? emailField.value.trim() : "";

    if (user.length < 3) {
        alert("Veuillez entrer un pseudo de 3 caractères minimum.");
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref') || MON_LIEN_RACINE;
    const monCodeRef = user.toLowerCase().replace(/\s/g, '');

    showNotification("Connexion à la matrice...");

    const { error } = await _supabase.from('users').insert([
        { 
            username: user, 
            email: mail, 
            referred_by: ref, 
            ref_code: monCodeRef 
        }
    ]);

    if (error) {
        console.error(error);
        alert("Erreur : " + error.message);
        return;
    }

    document.getElementById('step-registration').classList.add('hidden');
    document.getElementById('step-youtube').classList.remove('hidden');
    showNotification("Inscription validée !");
}

// --- 4. CHRONO YOUTUBE (ÉTAPE 2) ---
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
            btn.style.background = "#10b981";
            document.getElementById('step-victory').classList.remove('hidden');
        }
    }, 1000);
}

// --- 5. RÉCLAMER LE LIEN (ÉTAPE 3 - CORRIGÉE) ---
function openVictory() {
    // On récupère le pseudo saisi au début pour être sûr de reconnaître l'utilisateur
    const userSaisi = document.getElementById('username')?.value;
    const urlParams = new URLSearchParams(window.location.search);
    const parrainURL = urlParams.get('ref');

    // On utilise le pseudo de l'utilisateur s'il existe, sinon le parrain
    let finalID = userSaisi || parrainURL || MON_LIEN_RACINE;
    finalID = finalID.toLowerCase().replace(/\s/g, '');

    window.open(`https://victory-automatic.com/register/${finalID}`, "_blank");

    const statusLabel = document.getElementById('user-status');
    if (statusLabel) {
        statusLabel.innerText = "ACTIF";
        statusLabel.style.color = "#10b981";
    }
}

// --- 6. PARTAGE ET TIMER ---
function shareVideo() {
    const user = document.getElementById('username').value;
    const monCodeRef = user.toLowerCase().replace(/\s/g, '');
    const shareLink = `${window.location.origin}${window.location.pathname}?ref=${monCodeRef}`;
    const message = `Rejoins Victory : ${shareLink}`;
    
    if (navigator.share) {
        navigator.share({ title: "Victory Boost", text: message, url: shareLink });
    } else {
        alert("Lien de partage : " + shareLink);
    }
}

let time = 86400;
setInterval(() => {
    if (time > 0) {
        let h = Math.floor(time / 3600);
        let m = Math.floor((time % 3600) / 60);
        let s = time % 60;
        const display = document.getElementById('countdown');
        if (display) display.innerHTML = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
        time--;
    }
}, 1000);
