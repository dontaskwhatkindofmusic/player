
function loadSongs() {
    fetch("js/songs.json")
        .then(response => response.json())
        .then(songFiles => {
            songFiles.forEach(filename => {
                let fullPath = `songs/${filename}`;
                extractMetadata(fullPath);
            });
        })
        .catch(error => console.error("Error loading songs:", error));
}

function extractMetadata(songPath) {
    let encodedPath = encodeURI(songPath);

    fetch(encodedPath)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => {
            jsmediatags.read(new Blob([arrayBuffer]), {
                onSuccess: function(tag) {
                    const { title, artist, album } = tag.tags;
                    const picture = tag.tags.picture;
                    let albumArt = "images/default-cover.jpg";

                    if (picture) {
                        let base64String = "";
                        for (let i = 0; i < picture.data.length; i++) {
                            base64String += String.fromCharCode(picture.data[i]);
                        }
                        albumArt = `data:${picture.format};base64,${btoa(base64String)}`;
                    }

                    getAudioDuration(songPath).then(length => {
                        const songData = { 
                            title: title || "Unknown", 
                            artist: artist || "Unknown", 
                            album: album || "Unknown", 
                            songPath: songPath,  // ✅ Make sure this is correctly set
                            albumArt: albumArt, 
                            length: length 
                        };
                        songs.push(songData); // Store song in queue
                        displaySongs();
                    });
                },
                onError: function(error) {
                    console.error("Error reading metadata:", error);
                }
            });
        })
        .catch(error => console.error("Error fetching song:", error));
}

// ✅ Get real duration from audio file
function getAudioDuration(filePath) {
    return new Promise((resolve) => {
        const audio = new Audio(filePath);
        audio.addEventListener("loadedmetadata", () => {
            resolve(audio.duration);
        });
    });
}

function displaySongs() {
    const songList = document.getElementById("song-list");
    songList.innerHTML = ""; 

    songs.forEach((song, index) => {
        const songRow = document.createElement("tr");
        songRow.innerHTML = `
            <td><img src="${song.albumArt}" class="album-art"></td>
            <td>${song.title}</td>
            <td>${song.artist}</td>
            <td>${song.album}</td>
            <td>${formatTime(song.length)}</td>
        `;

        // ✅ Add event listeners
        songRow.addEventListener("dblclick", () => togglePlayPause(index)); // Desktop double-click
        songRow.addEventListener("touchstart", (event) => handleDoubleTap(event, index)); // Mobile double-tap

        songList.appendChild(songRow);
    });
}

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
}

window.onload = loadSongs;