// --- 1. CONFIGURATION (À REMPLIR) ---
const SUPABASE_URL = "https://TON_PROJET.supabase.co";
const SUPABASE_KEY = "TA_CLE_ANON_ICI";
const MON_LIEN_RACINE = "tonIDparDefaut"; 
const LIEN_VIDEO_YOUTUBE = "https://youtube.com/watch?v=TON_CODE_ICI"; 

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- LOGIQUE DE NOTIFICATION ---
function showNotification(msg) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.innerText = msg;
        toast.style.display = 'block';
        setTimeout(() => toast.style.display = 'none', 3000);
    }
}

// --- ÉTAPE 1 : INSCRIPTION DANS LA BASE ---
async function startYoutubeStep() {
    const userField = document.getElementById('username');
    const emailField = document.getElementById('email'); // Assure-toi d'avoir id="email" dans ton HTML

    const user = userField ? userField.value.trim() : "";
    const mail = emailField ? emailField.value.trim() : "";

    if (user.length < 3) {
        alert("Veuillez entrer un pseudo valide (min 3 caractères).");
        return;
    }

    // Récupérer le parrain dans l'URL (?ref=...)
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref') || MON_LIEN_RACINE;

    // Créer le code de parrainage de l'utilisateur (minuscules, sans espaces)
    const monCodeRef = user.toLowerCase().replace(/\s/g, '');

    showNotification("Enregistrement en cours...");

    // ENVOI À SUPABASE
    const { error } = await _supabase.from('users').insert([
        { 
            username: user, 
            email: mail, 
            referred_by: ref, 
            ref_code: monCodeRef 
        }
    ]);

    if (error) {
        console.error("Erreur Supabase:", error);
        alert("Détail de l'erreur : " + (error.message || JSON.stringify(error)));
        return;
    }

    // Si ça marche, on cache le formulaire et on montre la vidéo
    document.getElementById('step-registration').classList.add('hidden');
    document.getElementById('step-youtube').classList.remove('hidden');
    showNotification("Profil créé ! Regardez la vidéo pour activer.");
}

// --- ÉTAPE 2 : LE CHRONO YOUTUBE (180s) ---
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
            showNotification("Félicitations ! Accès débloqué.");
        }
    }, 1000);
}

// --- ÉTAPE 3 : LIEN VICTORY & PARTAGE ---
function openVictory() {
    const urlParams = new URLSearchParams(window.location.search);
    const referralID = urlParams.get('ref') || MON_LIEN_RACINE;
    window.open(`https://victory-automatic.com/register/${referralID}`, "_blank");
}

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
