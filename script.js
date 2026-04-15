const btnSearch = document.getElementById('btn-search');
const queryInput = document.getElementById('query');
const audio = document.getElementById('audio-remote');
const playerUI = document.getElementById('player-ui');

btnSearch.addEventListener('click', () => {
    const word = queryInput.value.trim();
    if (!word) return;

    const oldScript = document.getElementById('deezer-script');
    if (oldScript) oldScript.remove();

    const script = document.createElement('script');
    script.id = 'deezer-script';
    
    /**
     * FILTRE RAP / CLUB :
     * On cherche le mot dans le titre (track)
     * On ajoute des mots clés comme "Rap" ou "Hip Hop" pour influencer l'algorithme
     * On garde le tri par date de sortie décroissante (nouveautés)
     */
    const searchUrl = `https://api.deezer.com/search?q=track:"${encodeURIComponent(word)}" rap hip-hop club&order=RELEASEDATE_DESC&output=jsonp&callback=handleResponse`;
    
    script.src = searchUrl;
    document.body.appendChild(script);
});

window.handleResponse = function(data) {
    if (data.data && data.data.length > 0) {
        // On sélectionne le premier résultat (le plus récent et pertinent)
        const track = data.data[0];
        displayUrbanHit(track);
    } else {
        alert("Pas de banger trouvé avec ce nom.");
    }
};

function displayUrbanHit(track) {
    playerUI.classList.remove('hidden');

    document.getElementById('track-title').innerText = track.title;
    document.getElementById('track-artist').innerText = `BY ${track.artist.name}`;
    document.getElementById('album-cover').src = track.album.cover_xl;

    // EFFET VISUEL : Fond d'écran avec l'image de l'album + filtre de couleur
    const bgUrl = track.album.cover_xl;
    document.body.style.backgroundImage = `linear-gradient(rgba(255,0,85,0.4), rgba(0,0,0,0.9)), url(${bgUrl})`;

    audio.src = track.preview;
    audio.play();
}

// Touche Entrée
queryInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') btnSearch.click();
});
