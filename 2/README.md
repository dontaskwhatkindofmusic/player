# Static Music Player

A fully-featured, local-first music player built with vanilla HTML, CSS, and JavaScript. Play music from your computer or phone without uploading files anywhere.

## Features

### Core Playback
- **Play any audio format**: MP3, WAV, FLAC, M4A, OGG, AAC
- **Standard controls**: Play/Pause, Previous/Next, Seek, Volume
- **Shuffle & Repeat modes**: Shuffle all, repeat all, or repeat single track
- **Keyboard shortcuts**: Press Space to play/pause

### Library Management
- **Browse local folders**: Select any folder on your computer via the File System Access API
- **Recursive folder scanning**: Automatically finds music in subdirectories
- **Metadata extraction**: Reads ID3 tags (MP3) and M4A tags for artist, album, year, genre
- **Smart library**: Handles large libraries efficiently (thousands of songs)
- **Remove songs**: Temporarily hide songs from your library without deleting them

### Search & Filtering
- **Quick search**: Search by song title, artist, or album
- **Advanced filters**: 
  - Filter by artist
  - Filter by genre
  - Filter by year
  - Combine multiple filters
- **Persistent library state**: Your filters, removed songs, and settings are saved locally

### Device Integration
- **Media Session API**: 
  - Lock screen controls on iOS (with Safari bookmark)
  - Android notification controls
  - Mac Control Center integration
  - Headphone button support
- **Responsive design**: Works on desktop, tablet, and mobile
- **Touch-friendly UI**: Large buttons and swipe-ready layout

### Offline & PWA Support
- **Progressive Web App**: Install as a native-like app on your phone
- **Offline playback**: Works without internet connection
- **Service Worker caching**: App shell cached for instant loading
- **Home screen bookmark**: Add to iOS home screen or Android home screen
- **Persistent storage**: All settings stored locally in IndexedDB

## How to Use

### Desktop
1. **Open the player**: Open `music-player.html` in a modern browser (Chrome, Safari, Firefox, Edge)
2. **Select your music folder**: Click the green "📁 Select" button
3. **Grant folder access**: Choose a folder containing your music (or your iTunes library folder)
4. **Start playing**: Click a song in the library or press Play

### iPhone
1. **Open in Safari**: Navigate to the music player HTML file or open it locally
2. **Add to Home Screen**: 
   - Tap the Share button (square with arrow)
   - Tap "Add to Home Screen"
   - Tap "Add"
3. **Open the app**: Tap the icon on your home screen
4. **Select music**: Use the built-in file picker to access your iPhone's music folder or iCloud Drive

### Android
1. **Open in Chrome**: Navigate to the music player
2. **Install the app**: 
   - Tap the menu (three dots)
   - Tap "Install app" or "Add to Home Screen"
   - Tap "Install"
3. **Open the app**: Tap the app icon
4. **Select music**: Choose a folder from your phone's storage

## Technical Architecture

### Frontend (Client-Side Only)
```
music-player.html     // Main UI and player logic
├── HTML Structure    // Responsive layout
├── CSS Styling       // Modern dark theme
└── JavaScript
    ├── File System Access API    // Read local folders
    ├── Web Audio API             // Playback
    ├── Media Session API         // Device controls
    ├── IndexedDB                 // Persistent storage
    └── Service Worker            // Offline support
```

### How It Works

#### File Access
- Uses the **File System Access API** to request folder access
- User controls what folder is accessible
- No files are uploaded or transmitted
- All processing happens in your browser

#### Metadata Extraction
- **ID3v2.3/2.4 tags** (MP3 files): Reads artist, title, album, year, genre
- **M4A atoms**: Extracts metadata from iTunes-compatible files
- **Fallback**: Uses filename if metadata is missing
- **Browser-based**: All extraction happens locally

#### Storage
- **IndexedDB**: Stores removed songs, shuffle/repeat state, volume, folder handle
- **No server needed**: All data stays on your device
- **Persistent**: Settings survive browser refresh and app restart

#### Device Controls
- **Media Session API**: Sends playback state to OS
- **Lock screen buttons**: Control from iOS lock screen or Android notification
- **Keyboard media keys**: Play/Pause on dedicated media buttons

#### Offline Mode
- **Service Worker**: Caches app shell (HTML, CSS, JS)
- **Instant loading**: App loads immediately, even offline
- **Music files**: Stored locally on your device (not cached)
- **PWA mode**: When installed as app, works fully offline

## Browser Support

### Desktop
- ✅ Chrome/Edge 86+
- ✅ Safari 15+
- ✅ Firefox (limited File System Access, use drag-drop alternative)
- ✅ Opera

### Mobile
- ✅ iOS Safari 15+ (via home screen bookmark)
- ✅ Android Chrome
- ✅ Samsung Internet
- ✅ Firefox Android

**Note**: File System Access API requires HTTPS or localhost. Desktop use requires a modern browser.

## File Format Support

### Supported Audio Formats
- MP3 (.mp3)
- WAV (.wav)
- FLAC (.flac)
- M4A (.m4a)
- AAC (.aac)
- OGG (.ogg)

### Metadata Extraction
- **ID3v2.3**: MP3 files (most common)
- **ID3v2.4**: MP3 files
- **M4A atoms**: iTunes and Apple Music files
- **Fallback**: Filename parsing if metadata unavailable

## Tips & Tricks

### iTunes Library
To use your iTunes library:
1. Locate your Music folder (usually `~/Music/Music/Media/Music` on macOS, `%USERPROFILE%\Music` on Windows)
2. Select this folder when prompted
3. The player will recursively find all songs in subdirectories

### Large Libraries
The player efficiently handles libraries with thousands of songs:
- Lazy renders library items (only visible ones)
- Metadata cached after first load
- Filters computed on demand

### Removed Songs
If you remove songs and want them back:
1. Go to Settings tab
2. Click "Clear Removed Songs"
3. All songs reappear

### Offline Listening
To ensure offline playback works:
1. Open the app at least once to cache the service worker
2. Add the app to your home screen
3. Close and reopen the app — should load instantly
4. Playback works without internet

### Device Controls
For lock screen controls to work:
1. Press Play/Pause once to start playing
2. Lock your device
3. Controls should appear on lock screen (iOS/Android)
4. Control Center integration works on Mac

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Space | Play/Pause |
| Click progress bar | Seek to position |
| Click volume slider | Adjust volume |

## Privacy & Security

✅ **All processing is local** — no data sent to servers  
✅ **No tracking** — no analytics or cookies  
✅ **File access is sandboxed** — browser controls folder permissions  
✅ **Metadata stays local** — extracted in your browser, not uploaded  
✅ **Settings saved locally** — IndexedDB only, device-only storage  

## Known Limitations

1. **Desktop Firefox**: File System Access API not yet supported; use Chrome/Safari
2. **FLAC metadata**: Basic support; complex FLAC files may show filename only
3. **Album art**: Currently displays generic icon; embedding album art support coming
4. **Gapless playback**: Not yet implemented (minor gaps between tracks)
5. **Playlists**: Not yet implemented (can be added as future feature)
6. **Syncing**: Settings don't sync across devices (local-only)

## Future Enhancements

- Album art extraction from ID3/M4A tags
- Gapless playback
- Custom playlists and favorites
- Library statistics and listening time
- Equalizer controls
- Sleep timer
- Lyrics display
- Theme customization
- Multi-device sync (optional, server-based)

## Troubleshooting

### "Select a folder to load your music"
- Click the green "Select" button
- Grant folder access when prompted
- Choose a folder containing audio files

### No songs appearing
- Ensure folder contains supported audio formats
- Check that folders have read permissions
- Try a different folder to test

### Metadata not showing
- Metadata depends on ID3/M4A tags in files
- Update tags in iTunes, Spotify, or tag editor
- Player falls back to filename if tags missing

### Playback not working
- Check browser console for errors (F12)
- Ensure audio file is not corrupted
- Try a different audio file
- Refresh the page and try again

### Offline mode not working
- Ensure you've opened the app at least once
- Check that Service Worker is registered (Chrome DevTools > Application tab)
- Try adding app to home screen for full PWA experience

### Lock screen controls not appearing
- Start playback first (press Play)
- Lock your device
- Control Center/notification should appear automatically
- Some browsers/OS may require app to be in foreground

## How to Deploy

### Local Use (No Server)
1. Save all files in a folder
2. Open `music-player.html` in your browser
3. On mobile, bookmark in Safari or install in Chrome

### Web Server (HTTPS Required)
If hosting on a web server:
1. Upload all files to web server
2. Ensure HTTPS is enabled (required for File System Access API)
3. Share the URL with others
4. Each user can select their own local folders

### Electron App (Future)
Could wrap this in Electron for a true desktop app with native file access.

## Technical Details

### IndexedDB Schema
```javascript
{
  shuffle: boolean,
  repeatMode: 'off' | 'all' | 'one',
  volume: 0-1,
  removedSongs: [path1, path2, ...],
  libraryHandleStr: JSON (File System Access handle)
}
```

### File System Access Permission
Users explicitly grant folder access via browser dialog. Permissions are:
- Persistent (unless user revokes)
- Read-only (unless app requests write access)
- Sandboxed to selected folder
- Shown to user in browser settings

### Service Worker Strategy
- **Cache-first** for HTML/CSS/JS (app shell)
- **Network-first** for audio files (always from device storage)
- **Graceful degradation**: App works with or without service worker

## License

Open source — use freely, modify, and distribute.

## Support

If you encounter issues:
1. Check the Troubleshooting section above
2. Open browser DevTools (F12) and check for errors
3. Try on a different browser to isolate the issue
4. Ensure your music files are valid audio files

Enjoy your music! 🎵
