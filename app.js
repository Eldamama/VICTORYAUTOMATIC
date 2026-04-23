// --- ÉTAPE 3 : ENVOYER VERS LE PARRAIN ---
function openVictory() {
    const urlParams = new URLSearchParams(window.location.search);
    const parrainURL = urlParams.get('ref') || MON_LIEN_RACINE;

    // On ouvre le lien du parrain pour qu'il s'inscrive là-bas
    window.open(`https://victory-automatic.com/register/${parrainURL}`, "_blank");

    // On affiche maintenant le dernier champ pour qu'il colle SON lien Victory
    document.getElementById('final-setup').classList.remove('hidden');
    showNotification("Inscrivez-vous sur Victory, puis revenez coller votre ID ici.");
}

// --- ÉTAPE 4 : ACTIVER LE LIEN PERSONNEL (NOUVEAU) ---
async function activerMonLien() {
    const pseudoLocal = document.getElementById('username').value;
    const victoryID = document.getElementById('victory-id-input').value.trim();

    if (!victoryID) {
        alert("Veuillez coller votre ID Victory pour continuer.");
        return;
    }

    // On met à jour la base de données avec son ID Victory
    const { error } = await _supabase
        .from('users')
        .update({ ref_code: victoryID }) // On remplace le pseudo par son vrai ID Victory
        .eq('username', pseudoLocal);

    if (error) {
        alert("Erreur de mise à jour : " + error.message);
    } else {
        showNotification("Lien activé ! Vous pouvez maintenant partager.");
        document.getElementById('step-share').classList.remove('hidden');
    }
}
