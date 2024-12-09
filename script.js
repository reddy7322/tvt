let currentSongIndex = 0;
let songs = [];
let audio = document.getElementById('audio');
let playButton = document.getElementById('play');
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
        let response = await fetch(`${apiUrl}${query}&page=1&limit=100`);
        let data = await response.json();
        songs = data.data.results;

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

    // Get the audio source URL for the song (API provides this directly or fallback)
    const downloadUrl = selectedSong.url || selectedSong.album.url || selectedSong.album.image[2].url; // Use album or fallback to artist image if no album is found.

    audio.src = downloadUrl;
    audio.play();
    playButton.textContent = "pause"; // Change icon to pause when playing

    // Update song info
    songName.textContent = selectedSong.name;
    songArtist.textContent = selectedSong.artists.primary.map(artist => artist.name).join(", ");
    songArtwork.src = selectedSong.album ? selectedSong.album.image[2].url : selectedSong.artists.primary[0].image[2].url; // Get album artwork or artist image
    songArtwork.style.display = "block";  // Make sure the artwork is visible
}

function togglePlay() {
    if (audio.paused) {
        audio.play();
        playButton.textContent = "pause"; // Change to pause icon
    } else {
        audio.pause();
        playButton.textContent = "play_arrow"; // Change to play icon
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
