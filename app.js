// --- CONFIGURATION ---
const _supabase = supabase.createClient("TA_SUPABASE_URL", "TON_ANON_KEY");
const MON_LIEN_RACINE = "TON_ID_RACINE"; 
const LIEN_VIDEO_YOUTUBE = "https://youtube.com/watch?v=TON_CODE_ICI"; 

// --- LOGIQUE DE NOTIFICATION ---
function showNotification(msg) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.innerText = msg;
        toast.style.display = 'block';
        setTimeout(() => toast.style.display = 'none', 3000);
    }
}

// --- ÉTAPE 1 : INSCRIPTION RÉELLE DANS SUPABASE ---
async function startYoutubeStep() {
    const user = document.getElementById('username').value;
    const mail = document.getElementById('email')?.value || ""; // Ajoute un champ email dans ton HTML si besoin

    if (user.length < 3) {
        alert("Veuillez entrer un pseudo valide.");
        return;
    }

    // Récupération du parrain dans l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref') || MON_LIEN_RACINE;

    // Génération du code de parrainage de l'utilisateur
    const monCodeRef = user.toLowerCase().replace(/\s/g, '');

    // ENREGISTREMENT DANS SUPABASE
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
        alert("Erreur lors de l'enregistrement. Vérifiez votre connexion.");
        return;
    }

    // Si succès, on passe à l'étape suivante
    document.getElementById('step-registration').classList.add('hidden');
    document.getElementById('step-youtube').classList.remove('hidden');
    showNotification("Profil créé avec succès !");
}

// --- ÉTAPE 2 : LE VERROU DE 180 SECONDES ---
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

// --- ÉTAPE 3 : REDIRECTION VICTORY ---
function openVictory() {
    const urlParams = new URLSearchParams(window.location.search);
    const referralID = urlParams.get('ref') || MON_LIEN_RACINE;

    const finalLink = `https://victory-automatic.com/register/${referralID}`;
    window.open(finalLink, "_blank");

    const statusLabel = document.getElementById('user-status');
    if (statusLabel) {
        statusLabel.innerText = "ACTIF";
        statusLabel.style.color = "#10b981";
    }
}

// --- ÉTAPE 4 : PARTAGE DU LIEN PERSONNEL ---
function shareVideo() {
    const user = document.getElementById('username').value;
    const monCodeRef = user.toLowerCase().replace(/\s/g, '');
    const shareLink = `${window.location.origin}${window.location.pathname}?ref=${monCodeRef}`;
    
    const message = `Rejoins Victory et booste tes revenus : ${shareLink}`;
    
    if (navigator.share) {
        navigator.share({ title: "Victory Boost", text: message, url: shareLink });
    } else {
        alert("Copie ton lien : " + shareLink);
    }
}

// --- TIMER DE 24H ---
let time = 86400;
setInterval(() => {
    if (time > 0) {
        let hours = Math.floor(time / 3600);
        let mins = Math.floor((time % 3600) / 60);
        let secs = time % 60;
        const timerDisplay = document.getElementById('countdown');
        if (timerDisplay) {
            timerDisplay.innerHTML = `${String(hours).padStart(2,'0')}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
        }
        time--;
    }
}, 1000);
