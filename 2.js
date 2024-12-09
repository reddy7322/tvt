const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const playButton = document.getElementById('playButton');
const audioPlayer = document.getElementById('audioPlayer');
const songImage = document.getElementById('songImage');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const songSelector = document.getElementById('songSelector');
const progressBar = document.getElementById('progress-bar');
const currentTimeElement = document.getElementById('current-time');
const progressContainer = document.getElementById('progress-area');

let songs = [];
let currentSongIndex = 0;

const queries = [
    'Telugu', 'SBP', 'Devi Sri Prasad', 'Mani Sharma', 'love', 'Anoop Rubens',
    'Ilaiyaraaja', 'Keeravani', 'K.J. Yesudas', 'Thaman S'
];

function fetchSongs(query) {
    const url = `https://saavn.dev/api/search/songs?query=${query}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            songs = data.data.results;
            updateUI();
        })
        .catch(err => console.error(err));
}

function updateUI() {
    const song = songs[currentSongIndex];
    if (song) {
        audioPlayer.src = song.downloadUrl[4].url;
        songImage.src = song.image[2].url;
        document.getElementById('name').textContent = song.name;
        document.getElementById('artist').textContent = song.primaryArtists;
        document.getElementById('max-duration').textContent = secondsToMinSec(song.duration);
    }
}

function secondsToMinSec(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

playButton.addEventListener('click', () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playButton.textContent = 'pause';
    } else {
        audioPlayer.pause();
        playButton.textContent = 'play_arrow';
    }
});

prevButton.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex > 0) ? currentSongIndex - 1 : songs.length - 1;
    updateUI();
});

nextButton.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    updateUI();
});

audioPlayer.addEventListener('timeupdate', () => {
    progressBar.style.width = `${(audioPlayer.currentTime / audioPlayer.duration) * 100}%`;
    currentTimeElement.textContent = secondsToMinSec(audioPlayer.currentTime);
});

// Initial fetch
fetchSongs(queries[Math.floor(Math.random() * queries.length)]);
