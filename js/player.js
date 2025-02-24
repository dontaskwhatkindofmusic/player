// 🎵 Music Player Script
// ===========================
// Manages playback, progress bar, scrubbing, and UI updates

// 🎯 Global Variables
let currentIndex = 0; // Current song index
let isPlaying = false; // Play state
let shuffleMode = false; // Shuffle mode toggle
let songs = []; // Holds song data
let lastTap = 0; // For double-tap detection

// 🎯 DOM Elements
const player = document.getElementById("audioPlayer");
const progressBar = document.getElementById("progress-bar");
const progressContainer = document.getElementById("progress-container");
const timeDisplay = document.getElementById("time-display");
const trackDisplay = document.getElementById("current-track");
const playButton = document.getElementById("play-btn");

// 📌 Toggle Play/Pause on Double Click or Tap
function togglePlayPause(index) {
    if (currentIndex === index && isPlaying) {
        player.pause();
        isPlaying = false;
    } else {
        playSong(index);
    }
    updatePlayerUI();
}

// 📌 Play a Song by Index
function playSong(index) {
    if (!songs.length) return console.error("Error: No songs loaded!");
    if (index < 0 || index >= songs.length) return console.error("Error: Invalid song index", index);

    currentIndex = index;
    const track = songs[currentIndex];

    if (!track || !track.songPath) return console.error(`Error: Track data missing at index ${index}`, track);

    console.log(`Now Playing: ${track.title} - ${track.artist}`);

    player.src = track.songPath;
    player.play().catch(error => console.error("Playback Error:", error));

    isPlaying = true;
    updatePlayerUI();
    updateMediaSession();
}

// 📌 Play/Pause Toggle Button
function togglePlay() {
    if (player.paused) {
        player.play();
        isPlaying = true;
    } else {
        player.pause();
        isPlaying = false;
    }
    updatePlayerUI();
}

// 📌 Update UI (Track Title & Play Button)
function updatePlayerUI() {
    const track = songs[currentIndex] || { title: "Unknown", artist: "Unknown" };
    trackDisplay.innerText = isPlaying
        ? `Now Playing: ${track.title} - ${track.artist}`
        : `Paused: ${track.title} - ${track.artist}`;

    playButton.innerText = isPlaying ? "⏸" : "▶"; // Update play button icon
}

// 📌 Media Session API Integration for iPhone Lock Screen
// This updates album art, title, and adds lock screen controls

function updateMediaSession() {
    if (!('mediaSession' in navigator)) {
        console.warn("Media Session API not supported in this browser.");
        return;
    }

    const track = songs[currentIndex] || { title: "Unknown", artist: "Unknown", albumArt: "images/default-cover.jpg" };

    // ✅ Update metadata (title, artist, album art)
    navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.artist,
        album: "Album Unknown",
        artwork: [
            { src: track.albumArt, sizes: "96x96", type: "image/jpeg" },
            { src: track.albumArt, sizes: "128x128", type: "image/jpeg" },
            { src: track.albumArt, sizes: "192x192", type: "image/jpeg" },
            { src: track.albumArt, sizes: "256x256", type: "image/jpeg" },
            { src: track.albumArt, sizes: "384x384", type: "image/jpeg" },
            { src: track.albumArt, sizes: "512x512", type: "image/jpeg" }
        ]
    });

    // ✅ Lock Screen Controls
    navigator.mediaSession.setActionHandler("play", () => {
        player.play();
        isPlaying = true;
        updatePlayerUI();
    });

    navigator.mediaSession.setActionHandler("pause", () => {
        player.pause();
        isPlaying = false;
        updatePlayerUI();
    });

    navigator.mediaSession.setActionHandler("previoustrack", () => {
        prevTrack();
    });

    navigator.mediaSession.setActionHandler("nexttrack", () => {
        nextTrack();
    });

    navigator.mediaSession.setActionHandler("seekto", (details) => {
        if (details.seekTime) {
            player.currentTime = details.seekTime;
        }
    });

    console.log("Media session updated:", track.title, "-", track.artist);
}

// 🎵 Track Progress Updates
player.addEventListener("timeupdate", function () {
    if (!player.duration) return;

    const percent = (player.currentTime / player.duration) * 100;
    progressBar.style.width = percent + "%";

    timeDisplay.innerText = `${formatTime(player.currentTime)} / ${formatTime(player.duration)}`;
});

// 📌 Click Progress Bar to Seek
function seekTrack(event) {
    const clickX = event.offsetX;
    const width = progressContainer.clientWidth;
    const percent = clickX / width;
    player.currentTime = percent * player.duration;
}

// 📌 Format Time (mm:ss)
function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
}

// 📌 Play Next Track
function nextTrack() {
    currentIndex = shuffleMode ? Math.floor(Math.random() * songs.length) : (currentIndex + 1) % songs.length;
    playSong(currentIndex);
}

// 📌 Play Previous Track
function prevTrack() {
    currentIndex = (currentIndex - 1 + songs.length) % songs.length;
    playSong(currentIndex);
}

// 📌 Stop Playback
function stopTrack() {
    player.pause();
    player.currentTime = 0;
    isPlaying = false;
    updatePlayerUI();
}

// 📌 Shuffle Mode Toggle
function shuffleTracks() {
    shuffleMode = !shuffleMode;
}

// 📌 Handle Double Tap on Mobile

let lastTapTime = 0;

function handleDoubleTap(event, index) {
    event.preventDefault(); // Prevents unintended long-press behavior

    const currentTime = new Date().getTime();
    const tapGap = currentTime - lastTapTime;

    if (tapGap < 300) { // ✅ Properly detects a double tap within 300ms
        togglePlayPause(index);
    }

    lastTapTime = currentTime;
}

// 🎵 Auto-Play Next Track When Current Ends
player.addEventListener("ended", nextTrack);

// 📌 Ensure Audio Player Exists Before Attaching Events
document.addEventListener("DOMContentLoaded", function () {
    if (player) {
        player.addEventListener("ended", nextTrack);
    } else {
        console.error("Error: Audio player not found!");
    }
});