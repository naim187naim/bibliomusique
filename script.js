const btnSearch = document.getElementById('btn-search');
const btnVoice = document.getElementById('btn-voice');
const queryInput = document.getElementById('query');
const audio = document.getElementById('audio-remote');
const playerUI = document.getElementById('player-ui');
const bgOverlay = document.getElementById('bg-overlay');

/**
 * RECHERCHE DEEZER
 */
const searchMusic = () => {
    const word = queryInput.value.trim();
    if (!word) return;

    const oldScript = document.getElementById('deezer-script');
    if (oldScript) oldScript.remove();

    const script = document.createElement('script');
    script.id = 'deezer-script';
    // On force Rap/Club et les sorties les plus récentes
    script.src = `https://api.deezer.com/search?q=track:"${encodeURIComponent(word)}" rap hip-hop club&order=RELEASEDATE_DESC&output=jsonp&callback=handleResponse`;
    document.body.appendChild(script);
};

btnSearch.addEventListener('click', searchMusic);

window.handleResponse = function(data) {
    if (data.data && data.data.length > 0) {
        const track = data.data[0];
        // Affichage
        playerUI.classList.remove('hidden');
        document.getElementById('track-title').innerText = track.title;
        document.getElementById('track-artist').innerText = track.artist.name;
        document.getElementById('album-cover').src = track.album.cover_xl;
        // Fond plein écran
        bgOverlay.style.backgroundImage = `url(${track.album.cover_xl})`;
        // Audio
        audio.src = track.preview;
        audio.play();
    }
};

/**
 * VOIX STYLE WHATSAPP (Maintenir pour parler)
 */
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';

    // Gestion de l'appui (Mobile & Desktop)
    const startListening = (e) => {
        e.preventDefault();
        recognition.start();
        btnVoice.classList.add('active');
        btnVoice.innerText = "Lâche pour chercher...";
    };

    const stopListening = () => {
        recognition.stop();
        btnVoice.classList.remove('active');
        btnVoice.innerText = "Maintenir pour parler";
    };

    btnVoice.addEventListener('mousedown', startSearchVoice); // Desktop
    btnVoice.addEventListener('touchstart', startSearchVoice); // Mobile
    btnVoice.addEventListener('mouseup', stopListening);
    btnVoice.addEventListener('touchend', stopListening);

    function startSearchVoice(e) {
        e.preventDefault();
        recognition.start();
        btnVoice.classList.add('active');
    }

    recognition.onresult = (event) => {
        queryInput.value = event.results[0][0].transcript;
        searchMusic();
    };
}
