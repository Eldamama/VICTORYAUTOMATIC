// --- CONFIGURATION ---
const MON_LIEN_RACINE = "tonIDparDefaut"; // Remplace par ton ID Victory racine
const LIEN_VIDEO_YOUTUBE = "https://youtube.com/watch?v=TON_CODE_ICI"; // Mets ta vidéo neutre

// --- LOGIQUE DE NOTIFICATION ---
function showNotification(msg) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.innerText = msg;
        toast.style.display = 'block';
        setTimeout(() => toast.style.display = 'none', 3000);
    }
}

// --- ÉTAPE 1 : TRANSITION APRÈS INSCRIPTION ---
function startYoutubeStep() {
    const user = document.getElementById('username').value;
    if (user.length < 3) {
        alert("Veuillez entrer un pseudo valide pour continuer.");
        return;
    }
    document.getElementById('step-registration').classList.add('hidden');
    document.getElementById('step-youtube').classList.remove('hidden');
    showNotification("Pseudo enregistré. Prêt pour le boost !");
}

// --- ÉTAPE 2 : LE VERROU DE 180 SECONDES ---
function handleYoutubeInteraction() {
    // Ouvrir la vidéo YouTube dans un nouvel onglet
    window.open(LIEN_VIDEO_YOUTUBE, "_blank");

    const btn = document.getElementById('btn-video');
    let timeLeft = 180; // durée de 3 minutes
    btn.disabled = true;

    const countdown = setInterval(() => {
        timeLeft--;
        btn.innerText = `Validation du soutien... ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(countdown);
            btn.innerText = "✅ SOUTIEN ORGANIC VALIDÉ";
            btn.style.background = "#10b981";

            document.getElementById('step-victory').classList.remove('hidden');
            showNotification("Félicitations ! Votre accès est prêt.");
        }
    }, 1000);
}

// --- ÉTAPE 3 : REDIRECTION DYNAMIQUE ---
function openVictory() {
    const urlParams = new URLSearchParams(window.location.search);
    let referralID = urlParams.get('ref');

    if (!referralID) {
        referralID = MON_LIEN_RACINE;
    }

    const finalLink = `https://victory-automatic.com/register/${referralID}`;
    window.open(finalLink, "_blank");

    const statusLabel = document.getElementById('user-status');
    if (statusLabel) {
        statusLabel.innerText = "ACTIF";
        statusLabel.style.color = "#10b981";
        statusLabel.classList.remove('status-inactive');
        statusLabel.classList.add('status-active');
    }

    showNotification("Bienvenue dans la matrice Victory !");
}

// --- ÉTAPE 4 : GÉNÉRATION DE LIEN DE PARTAGE ---
function getShareLink(userID) {
    return `${window.location.origin}${window.location.pathname}?ref=${userID}`;
}

function shareVideo(userID) {
    const shareLink = getShareLink(userID);
    const message = `Regarde cette vidéo et rejoins Victory : ${LIEN_VIDEO_YOUTUBE}\n\nInscris-toi ici : ${shareLink}`;
    
    if (navigator.share) {
        navigator.share({
            title: "Boost Victory",
            text: message,
            url: shareLink
        }).then(() => {
            showNotification("Vidéo partagée avec ton lien personnel !");
        }).catch(console.error);
    } else {
        alert("Copie ce lien et partage-le : " + shareLink);
    }
}

// --- TIMER DE 24H ---
let time = 24 * 60 * 60;
const timerDisplay = document.getElementById('countdown');

setInterval(() => {
    let hours = Math.floor(time / 3600);
    let minutes = Math.floor((time % 3600) / 60);
    let seconds = time % 60;

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    if (timerDisplay) {
        timerDisplay.innerHTML = `${hours}:${minutes}:${seconds}`;
    }
    time--;
}, 1000);