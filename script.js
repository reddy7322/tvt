let currentSongIndex = 0;
let songs = [];
let audio = document.getElementById('audio');
let playButton = document.getElementById('play');
let volumeControl = document.getElementById('volume');
let songListDropdown = document.getElementById('song-list');
let progressBar = document.getElementById('progress-bar');
let songArtwork = document.getElementById('song-artwork');
let songName = document.getElementById('song-name');
let songArtist = document.getElementById('song-artist');
let timeDisplay = document.getElementById('time-display');

const apiUrl = "https://saavn.dev/api/search/songs?query=";

async function searchSongs() {
    let query = document.getElementById('search-bar').value;
    if (!query) {
        songListDropdown.innerHTML = "<option value=''>Select a song</option>";
        return;
    }

    try {
        let response = await fetch(`${apiUrl}${query}&page=1&limit=10`);
        let data = await response.json();
        songs = data.songs;

        songListDropdown.innerHTML = "<option value=''>Select a song</option>";
        songs.forEach((song, index) => {
            let option = document.createElement("option");
            option.value = index;
            option.textContent = song.name;
            songListDropdown.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching songs:", error);
    }
}

function playSong() {
    let selectedIndex = songListDropdown.value;
    if (selectedIndex === "") return;

    currentSongIndex = selectedIndex;
    let selectedSong = songs[currentSongIndex];

    audio.src = selectedSong.downloadUrl[3].url;  // 160kbps quality
    audio.play();
    playButton.textContent = "Pause";

    // Update song info
    songName.textContent = selectedSong.name;
    songArtist.textContent = selectedSong.primary_artists;
    songArtwork.src = selectedSong.image[2].url;  // 500x500 image
}

function togglePlay() {
    if (audio.paused) {
        audio.play();
        playButton.textContent = "Pause";
    } else {
        audio.pause();
        playButton.textContent = "Play";
    }
}

function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    songListDropdown.value = currentSongIndex;
    playSong();
}

function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    songListDropdown.value = currentSongIndex;
    playSong();
}

function adjustVolume() {
    audio.volume = volumeControl.value;
}

function seekSong() {
    const seekTime = (progressBar.value / 100) * audio.duration;
    audio.currentTime = seekTime;
}

audio.addEventListener('timeupdate', function () {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progress;

    const minutes = Math.floor(audio.currentTime / 60);
    const seconds = Math.floor(audio.currentTime % 60);
    timeDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
});
