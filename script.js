const btnSearch = document.getElementById('btn-search');
const btnVoice = document.getElementById('btn-voice');
const queryInput = document.getElementById('query');
const audio = document.getElementById('audio-remote');
const playerUI = document.getElementById('player-ui');

// Fonction Recherche
const searchMusic = () => {
    const word = queryInput.value.trim();
    if (!word) return;

    const oldScript = document.getElementById('deezer-script');
    if (oldScript) oldScript.remove();

    const script = document.createElement('script');
    script.id = 'deezer-script';
    // On force Rap/Club et Nouveautés
    script.src = `https://api.deezer.com/search?q=track:"${encodeURIComponent(word)}" rap hip-hop club&order=RELEASEDATE_DESC&output=jsonp&callback=handleResponse`;
    document.body.appendChild(script);
};

window.handleResponse = function(data) {
    if (data.data && data.data.length > 0) {
        const track = data.data[0];
        playerUI.classList.remove('hidden');
        document.getElementById('track-title').innerText = track.title;
        document.getElementById('track-artist').innerText = `BY ${track.artist.name.toUpperCase()}`;
        document.getElementById('album-cover').src = track.album.cover_xl;
        document.body.style.backgroundImage = `url(${track.album.cover_xl})`;
        audio.src = track.preview;
        audio.play();
    } else {
        alert("Rien trouvé d'assez lourd !");
    }
};

btnSearch.addEventListener('click', searchMusic);

/**
 * MICROPHONE (RECONNAISSANCE VOCALE)
 */
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';

    btnVoice.addEventListener('click', () => {
        recognition.start();
        btnVoice.innerText = "Listening...";
        btnVoice.style.background = "#00ff88";
    });

    recognition.onresult = (event) => {
        const result = event.results[0][0].transcript;
        queryInput.value = result;
        btnVoice.innerText = "🎤";
        btnVoice.style.background = "#ff0055";
        searchMusic();
    };

    recognition.onerror = () => {
        btnVoice.innerText = "🎤";
        btnVoice.style.background = "#ff0055";
        alert("Active le micro dans tes réglages !");
    };
} else {
    btnVoice.style.display = "none";
}
