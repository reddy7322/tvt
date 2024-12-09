let currentSongIndex = 0;
let songs = [];
let audio = document.getElementById('audio');
let playButton = document.getElementById('play');
let volumeControl = document.getElementById('volume');
let songListDropdown = document.getElementById('song-list');

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
        songs = data.songs; // assuming 'songs' is the array in the response

        // Populate the dropdown with songs
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

    // Set audio source to the selected song's download URL
    audio.src = selectedSong.downloadUrl[3].url;  // Using 160kbps quality
    audio.play();
    playButton.textContent = "Pause";
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
