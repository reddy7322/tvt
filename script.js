const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const playButton = document.getElementById('playButton');
const audioPlayer = document.getElementById('audioPlayer');
const songImage = document.getElementById('songImage');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const progressBar = document.getElementById('progress-bar');
const currentTimeElement = document.getElementById('current-time');
const progressContainer = document.getElementById('progress-area');
const songListContainer = document.getElementById('songList');
const downloadButton = document.getElementById('downloadButton');
const looperButton = document.getElementById('looper');
const loader = document.getElementById('loader');

let songs = [];
let currentSongIndex = 0;
let isLooping = false;

const queries = ['Telugu', 'SPB', 'Devi Sri Prasad', 'Mani Sharma', 'love', 'Ilaiyaraaja'];

function showLoader() {
  loader.style.display = 'flex';
}

function hideLoader() {
  loader.style.display = 'none';
}

function fetchSongs(query) {
  showLoader();
  const url = `https://saavn.dev/api/search/songs?query=${query}&page=1&limit=50`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      hideLoader();
      if (data.data && data.data.results) {
        songs = data.data.results;
        populateSongList();
        loadSong(currentSongIndex);
      } else {
        alert('No songs found!');
      }
    })
    .catch((error) => {
      hideLoader();
      console.error('Error fetching songs:', error);
    });
}

function populateSongList() {
  songListContainer.innerHTML = '';
  songs.forEach((song, index) => {
    const listItem = document.createElement('li');
    listItem.className = 'song-item';
    listItem.innerHTML = `
      <img src="${song.image[1].url}" alt="${song.name}">
      <div>
        <span>${song.name}</span>
        <p>${song.primaryArtists}</p>
      </div>`;
    listItem.addEventListener('click', () => {
      currentSongIndex = index;
      loadSong(currentSongIndex);
    });
    songListContainer.appendChild(listItem);
  });
}

function loadSong(index) {
  const song = songs[index];
  if (song) {
    audioPlayer.src = song.downloadUrl[4].url; // Use 320kbps quality
    songImage.src = song.image[2].url; // High-res image
    document.getElementById('name').textContent = song.name;
    document.getElementById('artist').textContent = song.primaryArtists;
    document.getElementById('max-duration').textContent = secondsToMinSec(song.duration);
    downloadButton.href = song.downloadUrl[4].url; // Set download URL
    audioPlayer.play();
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
  loadSong(currentSongIndex);
});

nextButton.addEventListener('click', () => {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(currentSongIndex);
});

looperButton.addEventListener('click', () => {
  isLooping = !isLooping;
  audioPlayer.loop = isLooping;
  looperButton.textContent = isLooping ? 'repeat_one' : 'repeat';
});

audioPlayer.addEventListener('timeupdate', () => {
  const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  progressBar.style.width = `${progressPercent}%`;
  currentTimeElement.textContent = secondsToMinSec(audioPlayer.currentTime);
});

progressContainer.addEventListener('click', (e) => {
  const clickX = e.offsetX;
  const duration = audioPlayer.duration;
  audioPlayer.currentTime = (clickX / progressContainer.offsetWidth) * duration;
});

searchButton.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (query) fetchSongs(query);
});

// Initial fetch of random songs
fetchSongs(queries[Math.floor(Math.random() * queries.length)]);
