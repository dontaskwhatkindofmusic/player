# Architecture & Technical Implementation

A deep dive into how the music player works, built for developers who want to understand or extend it.

## System Overview

```
┌─────────────────────────────────────────────────────┐
│         User Interface (HTML + CSS)                 │
│  - Library sidebar                                  │
│  - Now playing display                              │
│  - Player controls                                  │
│  - Filter/settings panels                           │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│         Application Logic (JavaScript)              │
│  - Playback engine                                  │
│  - Filter/search system                             │
│  - Device control integration                       │
│  - State management                                 │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│         Browser APIs                                │
│  - Web Audio / HTML5 <audio>                        │
│  - File System Access API                           │
│  - IndexedDB (persistent storage)                   │
│  - Media Session API                                │
│  - Service Worker (caching)                         │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│         System Resources                            │
│  - Local file system                                │
│  - Device storage                                   │
│  - Browser storage & cache                          │
└─────────────────────────────────────────────────────┘
```

## State Management

### Global State Object

```javascript
state = {
  songs: [],                      // All songs in library
  filteredSongs: [],              // Songs after filters/search applied
  currentIndex: -1,               // Currently playing song index
  isPlaying: false,               // Playback status
  isShuffle: false,               // Shuffle enabled
  repeatMode: 'off',              // 'off' | 'all' | 'one'
  volume: 0.7,                    // 0-1 scale
  libraryHandle: null,            // File System Access handle
  removedSongs: Set[],            // Set of removed song paths
  activeFilters: {
    artist: null,                 // Currently active artist filter
    genre: null,                  // Currently active genre filter
    year: null                     // Currently active year filter
  }
}
```

### State Persistence

**Where**:
- IndexedDB (`MusicPlayerDB` database, `playerState` object store)
- Saves: shuffle, repeatMode, volume, removedSongs, libraryHandle reference

**When**:
- After any setting change
- After library modifications
- After shuffle/repeat toggle

**Why**:
- Settings survive page refresh
- Removed songs persist
- Library folder remembered (user can revoke access)

## Data Flow

### Loading Music Library

```
User clicks "Select" button
         ↓
showDirectoryPicker() [File System Access API]
         ↓
User grants folder access
         ↓
scanDirectory(handle, path)
  └─ Recursively traverse folders
  └─ Identify audio files by extension
  └─ Get File object for each song
         ↓
extractMetadata(file, filename)
  ├─ Try ID3v2.3/2.4 (MP3)
  ├─ Try M4A atoms
  └─ Fallback to filename parsing
         ↓
Store song objects in state.songs[]
  └─ { file, name, path, title, artist, album, year, genre }
         ↓
Sort by artist, then title
         ↓
applyFilters() [search, advanced filters]
         ↓
updateLibraryUI() [render list]
```

### Playing a Song

```
User clicks library item or next track
         ↓
loadTrack(index)
  ├─ Set state.currentIndex = index
  ├─ Get song from state.filteredSongs[index]
  ├─ Create blob URL: URL.createObjectURL(song.file)
  └─ Set audio.src = blobURL
         ↓
play()
  ├─ audio.play()
  ├─ Set state.isPlaying = true
  └─ updateMediaSession()
         ↓
updateNowPlaying(song)
  ├─ Update title, artist, album display
  └─ Update album art
         ↓
updateMediaSession()
  ├─ Send metadata to MediaSession API
  └─ Register device control handlers
         ↓
[Audio plays]
         ↓
Audio 'ended' event fires
  ├─ If repeat === 'one': restart track
  └─ Else: nextTrack()
```

### Searching & Filtering

```
User types in search box or clicks filter chip
         ↓
applyFilters()
  ├─ Remove songs matching removedSongs set
  ├─ Filter by search query (title, artist, album)
  ├─ Filter by active artist/genre/year
  └─ Set state.filteredSongs = result
         ↓
updateFilterUI()
  ├─ Rebuild filter chips based on all songs
  └─ Mark active filters as highlighted
         ↓
updateLibraryUI()
  └─ Render library with filtered songs
         ↓
If currently playing song not in filteredSongs:
  └─ Stop playback (user filtered it away)
```

## File System Access API

### How It Works

**One-time grant**:
1. User clicks "Select" button
2. `showDirectoryPicker()` opens native file dialog
3. User selects a folder
4. Browser requests permission
5. User grants access (or denies)

**Subsequent access**:
- `libraryHandle` stored and reused
- No dialog shown on refresh
- User can revoke in browser settings

**Sandbox rules**:
- Only selected folder is accessible
- Read-only access (no write)
- Recursive access (subfolders included)

### Implementation

```javascript
// Request folder
const dirHandle = await window.showDirectoryPicker();

// Iterate files/folders
for await (const [name, handle] of dirHandle.entries()) {
  if (handle.kind === 'file') {
    // Get File object
    const file = await handle.getFile();
    // Read file data
    const buffer = await file.arrayBuffer();
  }
  else if (handle.kind === 'directory') {
    // Recurse
    await scanDirectory(handle, newPath);
  }
}

// Create playable URL
const url = URL.createObjectURL(file);
audio.src = url;
```

## Metadata Extraction

### ID3v2 Tags (MP3)

**Structure**:
- Header: "ID3" + version info (10 bytes)
- Frames: Each frame has ID (4 bytes) + size + data
- Common frame IDs:
  - TIT2 = Title
  - TPE1 = Artist
  - TALB = Album
  - TYER = Year
  - TCON = Genre

**Implementation**:
1. Read first 10 bytes to find tag size
2. Iterate through frames
3. For each frame, extract ID and decode text
4. Handle text encoding (ISO-8859-1, UTF-16, UTF-8)

```javascript
// Simplified ID3v2 extraction
if (view[0-2] === "ID3") {  // Check header
  const tagSize = decodeSynchsafe(view[6-9]);
  let pos = 10;
  while (pos < 10 + tagSize) {
    const frameID = String.fromCharCode(...view.slice(pos, pos+4));
    const frameSize = view[pos+4] << 24 | ... ;
    const frameData = view.slice(pos+10, pos+10+frameSize);
    
    const text = decodeText(frameData);
    if (frameID === 'TIT2') metadata.title = text;
    // ... etc
    
    pos += 10 + frameSize;
  }
}
```

### M4A/MP4 Atoms

**Structure**:
- Hierarchical atom format
- Each atom: size (4 bytes) + type (4 bytes) + data
- `ilst` atom contains metadata
- Common atoms:
  - `©nam` = Title
  - `©ART` = Artist
  - `©alb` = Album
  - `©day` = Year
  - `©gen` = Genre

**Current Implementation**:
- Simple scan for `ilst` atom
- Full M4A parsing deferred (complex)
- Production use would require `jsmediatags` library

## Audio Playback

### Web Audio Integration

```
<audio id="audioPlayer">
  └─ Handles decoding, playback, buffering
  
state.audio.src = blobURL
state.audio.play()
state.audio.pause()
state.audio.currentTime = seconds
state.audio.volume = 0-1
```

### Playback Events

| Event | Handler | Purpose |
|-------|---------|---------|
| `play` | Play started | Update UI |
| `pause` | Play paused | Update UI |
| `timeupdate` | Time advances | Update progress bar |
| `loadedmetadata` | Duration known | Update duration display |
| `ended` | Track finished | Play next or repeat |
| `seeking` | User seeks | Update progress |

## Device Control Integration (Media Session API)

### What It Does

Lets the OS control the player:
- Lock screen buttons (iOS/Android)
- Control Center buttons (Mac)
- Headphone media buttons
- Notification controls

### Implementation

```javascript
navigator.mediaSession.metadata = new MediaMetadata({
  title: 'Song Title',
  artist: 'Artist Name',
  album: 'Album Name',
  artwork: [{ src: '...', sizes: '...' }]
});

navigator.mediaSession.playbackState = 'playing'; // or 'paused'

navigator.mediaSession.setActionHandler('play', play);
navigator.mediaSession.setActionHandler('pause', pause);
navigator.mediaSession.setActionHandler('nexttrack', nextTrack);
navigator.mediaSession.setActionHandler('previoustrack', prevTrack);
navigator.mediaSession.setActionHandler('seekto', (details) => {
  audio.currentTime = details.seekTime;
});
```

### Browser Support

- ✅ Chrome/Edge (all platforms)
- ✅ Firefox (Mac/Linux)
- ✅ Safari (iOS 15+, limited macOS support)
- ✅ Samsung Internet

## Offline Support (Service Worker & PWA)

### Service Worker Lifecycle

```
Installation
  ↓
Cache app shell (HTML, CSS, JS)
  ↓
Activation
  ↓
Intercept network requests
  ├─ Documents/Scripts: Cache-first (cached? use it : fetch)
  ├─ Audio: Network-first (fetch? use it : fail)
  └─ Manifest: Fetch
  ↓
Updates
  ↓
New version detected → skip waiting → clients.claim()
  ↓
Old cache cleaned up
```

### Caching Strategy

**App Shell Cache-First**:
```javascript
fetch(request) → cache match → if miss → network fetch → cache update
```

**Audio Files Network-First**:
```javascript
fetch(request) → network (from device storage) → if fail → cached fallback
```

**Why Different?**:
- App shell: Small, should be instant
- Audio files: Large, stored locally, always available from device

## IndexedDB Storage

### Schema

```
Database: "MusicPlayerDB"
  Object Store: "playerState"
    Key: "config"
    Value: {
      shuffle: boolean,
      repeatMode: string,
      volume: number,
      removedSongs: string[],
      libraryHandleStr: string (JSON)
    }
```

### Access Pattern

```javascript
// Open DB
const db = await new Promise((resolve, reject) => {
  const req = indexedDB.open('MusicPlayerDB', 1);
  req.onsuccess = () => resolve(req.result);
  req.onerror = () => reject(req.error);
});

// Read
const tx = db.transaction('playerState', 'readonly');
const store = tx.objectStore('playerState');
const data = await new Promise((resolve) => {
  const req = store.get('config');
  req.onsuccess = () => resolve(req.result);
});

// Write
const tx = db.transaction('playerState', 'readwrite');
const store = tx.objectStore('playerState');
await new Promise((resolve) => {
  const req = store.put(data, 'config');
  req.oncomplete = resolve;
});
```

## UI Architecture

### Component Structure

```
Container
  ├─ Sidebar (Library)
  │   ├─ Library Header (buttons)
  │   ├─ Filter Input
  │   └─ Library List
  │
  ├─ Main Player
  │   ├─ Tab Buttons
  │   └─ Tab Contents
  │       ├─ Now Playing Tab
  │       ├─ Filters Tab
  │       └─ Settings Tab
  │
  └─ Controls (Bottom)
      ├─ Progress Bar
      └─ Control Buttons
```

### Responsive Breakpoints

```css
@media (max-width: 768px) {
  /* Stack vertically */
  .sidebar { width: 100%; border-right: none; border-bottom: 1px solid #333; }
  .main-content { flex-direction: column; }
  /* Shrink album art */
  .album-art { width: 160px; }
  /* Larger touch targets */
  .control-btn { width: 40px; }
}
```

## Performance Optimizations

### Library Rendering

**Problem**: Rendering 5000+ songs causes lag

**Solution**: Render only visible items (virtual scrolling possible future enhancement)

**Current**: DOM updates on filter/search

### Metadata Extraction

**Problem**: Parsing large ID3 tags is slow

**Solution**: 
- Extract only essential tags (skip images)
- Stop after finding main tags
- Cache results in memory
- Fallback to filename quickly

### Volume & Progress

**Problem**: Frequent UI updates on time slider

**Solution**: 
- Throttle timeupdate events (100ms)
- Use CSS transforms for smooth animations
- RequestAnimationFrame for smooth redraws

## Extensibility Points

### Adding New Metadata Extractors

```javascript
async function extractMetadata(file, filename) {
  // ... existing code ...
  
  if (filename.endsWith('.opus')) {
    await extractOpusMetadata(file, metadata);
  }
  
  return metadata;
}

async function extractOpusMetadata(file, metadata) {
  // Implement Vorbis comment extraction
}
```

### Adding New Filters

```javascript
state.activeFilters = {
  // ... existing ...
  bitrate: null,
  duration: null
}

function applyFilters() {
  state.filteredSongs = state.songs.filter(song => {
    // ... existing filters ...
    if (state.activeFilters.bitrate) {
      // Add bitrate filter
    }
    return true;
  });
}
```

### Adding Playlists

```javascript
state.playlists = {
  'My Playlist': ['path1', 'path2', ...],
  'Favorites': ['path3', 'path4', ...]
}

// Persist in IndexedDB
// Add UI for creating/managing playlists
```

### Theme Customization

```css
:root {
  --primary-color: #1db954;  /* Change green */
  --bg-color: #1a1a1a;       /* Change dark */
  --text-color: #fff;        /* Change white */
}

/* Update CSS to use variables */
.control-btn.play-pause {
  background: var(--primary-color);
}
```

## Testing Strategy

### Unit Tests Needed
- Metadata extraction (ID3, M4A)
- Filter/search logic
- Time formatting
- State management

### Integration Tests
- File selection flow
- Playback lifecycle
- Filter interactions
- Storage persistence

### E2E Tests
- Full user journey (select → play → filter → remove)
- Media controls
- Offline mode
- Mobile interactions

## Browser Compatibility Handling

### Feature Detection

```javascript
// Check File System Access API
if ('showDirectoryPicker' in window) {
  // Show folder picker
} else {
  // Show fallback (drag-drop, file input)
}

// Check Media Session API
if ('mediaSession' in navigator) {
  // Register handlers
}

// Check Service Worker
if ('serviceWorker' in navigator) {
  // Register service worker
}
```

### Graceful Degradation

- No FSA? → Fallback to file input (limited)
- No Media Session? → Player still works
- No Service Worker? → Works but no offline
- No IndexedDB? → Use localStorage (limited)

## Known Tradeoffs

| Decision | Tradeoff |
|----------|----------|
| Browser-based | No write access, permission dialog |
| Client-side metadata | Slower initial load, incomplete extraction |
| IndexedDB storage | Device-only, can't sync |
| Service Worker cache | Extra disk space, manual cache busting |
| Vanilla JS | No framework overhead, but more boilerplate |
| Single HTML file | Easier deployment, larger file size |

## Future Refactoring

### Code Organization
```
music-player.html          (current: all-in-one)
  ↓
music-player/
  ├─ index.html
  ├─ css/
  │   └─ style.css
  ├─ js/
  │   ├─ player.js
  │   ├─ library.js
  │   ├─ metadata.js
  │   ├─ storage.js
  │   └─ ui.js
  └─ sw.js
```

### Module System
```javascript
// Use ES6 modules for better organization
import { loadLibrary, scanDirectory } from './js/library.js';
import { extractMetadata } from './js/metadata.js';
// ... etc
```

### Build Process
- Webpack/Vite for bundling
- Minification for production
- Source maps for debugging
- Automated testing

---

This music player prioritizes **simplicity** and **privacy** over complexity. The entire codebase is human-readable and modifiable, making it perfect for learning or extending.

Happy coding! 🎵
