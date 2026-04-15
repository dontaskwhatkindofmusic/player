# Remote & Cached Libraries Guide

## What's New (v2.0)

The enhanced player now supports:
- **✅ Persistent library cache** — Survives page refresh
- **✅ Remote URL libraries** — Load music from GitHub, web servers, etc.
- **✅ Library statistics** — See cache size and song count
- **✅ Hybrid mode** — Use local OR remote (but not simultaneously)

---

## Feature 1: Persistent Library Cache

### How It Works

When you load a library (local or remote):
1. Player scans all songs and extracts metadata (title, artist, album, path)
2. **Only metadata is cached** in localStorage (~200 bytes per song)
3. Actual audio files are NOT cached (stream from source)
4. On refresh, metadata loads instantly from cache

### Storage Size

**Per song metadata:** ~200 bytes
- Title, artist, album, path

**For 1000 songs:** ~200 KB  
**For 10,000 songs:** ~2 MB

This is **minuscule** — localStorage limit is 5-10MB per domain.

### Example

```
localStorage:
  musicLibraryMetadata: [
    { title: "Song 1", artist: "Artist", album: "Album", path: "..." },
    { title: "Song 2", artist: "Artist", album: "Album", path: "..." },
    ... (1000 more songs)
  ]
  librarySourceType: "local"
  libraryRemoteUrl: ""
  libraryFolderPath: "Music"
  
Total size: ~200 KB
```

### Clear Cache

Go to Settings → "Clear Library Cache"  
This removes cached metadata, forcing a fresh scan on next load.

---

## Feature 2: Remote URL Libraries

### What It Does

Instead of selecting a local folder, you can **link to a remote URL** containing music files.

Supported sources:
- **GitHub repositories** — Music files in a repo
- **Web servers** — Any HTTPS server with music files
- **CDNs** — CloudFlare, AWS S3, etc.

### How It Works

#### Option A: GitHub (Easiest!)

1. Create a GitHub repository with your music files
2. Organize however you want:
   ```
   my-music-library/
   ├── songs/
   │   ├── song1.mp3
   │   ├── song2.mp3
   │   └── subfolder/
   │       └── song3.mp3
   └── README.md
   ```

3. In the player, go to Settings → "Remote Library"
4. Enter the GitHub URL:
   ```
   https://github.com/yourname/my-music-library/tree/main/songs
   ```

5. Click "📡 Load Remote Library"
6. Songs load and play directly from GitHub! 🎵

#### Option B: Custom Web Server

Host music on your own web server:

1. Create a `manifest.json` file:
   ```json
   {
     "songs": [
       {
         "title": "Song Title",
         "artist": "Artist Name",
         "album": "Album Name",
         "path": "song.mp3",
         "size": 5242880
       }
     ]
   }
   ```

2. Upload manifest.json and all music files to your server
3. Enter the server URL in the player:
   ```
   https://music.example.com/library
   ```

4. Click "📡 Load Remote Library"

### Example: GitHub Setup

```bash
# Create repo and add music
mkdir my-music-library
cd my-music-library
git init
mkdir songs
cp ~/Music/*.mp3 songs/
git add .
git commit -m "Add music library"
git push origin main
```

Then in the player:
```
https://github.com/yourname/my-music-library/tree/main/songs
```

### Supported Remote Formats

**GitHub:**
- Public repositories only (no auth needed)
- Any branch (main, master, etc.)
- Any folder path

**Web Servers:**
- HTTPS required (browsers block HTTP)
- Must have manifest.json at root
- Supports folders and subfolders

---

## Feature 3: Library Statistics

### What You'll See in Settings

| Stat | Meaning |
|------|---------|
| **Songs Loaded** | Total number of songs in current library |
| **Library Size** | Total file size of all songs (MB) |
| **Source** | 📁 Local or 📡 Remote |
| **Cache Size** | Size of cached metadata (KB) |

### Example Output

```
Songs Loaded:        1,247
Library Size:        3.2 GB
Source:              📡 Remote (GitHub)
Cache Size:          187 KB
```

The cache size is incredibly small even for large libraries!

---

## Use Cases

### Case 1: Personal Music Library (Local)

1. Keep your music on your computer
2. Open the player, select your Music folder
3. Library caches automatically
4. Next time you refresh, songs load instantly from cache ⚡

### Case 2: Shared Music Library (GitHub)

1. Create a public GitHub repo with your music
2. Share the player URL with friends
3. They enter your GitHub URL in the player
4. Everyone plays from the same remote library 🎶

### Case 3: Home Server

1. Host music on your Synology NAS or home server
2. Create a manifest.json listing all songs
3. Access from anywhere via HTTPS
4. Library caches on your device

### Case 4: Hybrid

1. Load from GitHub first (library caches)
2. Later, switch to local folder
3. Cache stores whichever you used last
4. Switch back anytime (cache preserved)

---

## Technical Details

### Storage Location

All data stored in **browser localStorage**:
- Not accessible to other websites (same-origin policy)
- Not sent to any server (stored locally)
- Survives browser restart (persistent)
- Clears if you clear browser data

### Cache Structure

```javascript
localStorage = {
  'musicLibraryMetadata': '[
    {title, artist, album, path},
    ...
  ]',
  'librarySourceType': 'local|remote|none',
  'libraryRemoteUrl': 'https://...',
  'libraryFolderPath': 'Music'
}
```

### Size Limits

| Browser | localStorage Limit |
|---------|-------------------|
| Chrome | 10 MB |
| Safari | 5 MB |
| Firefox | 10 MB |
| Edge | 10 MB |

For most users: ~50,000 songs can cache before hitting limits.

### Security

✅ **CORS protected** — Can only load from same origin or CORS-enabled servers  
✅ **No authentication sent** — Cookies/auth tokens never included  
✅ **Read-only** — Can't modify remote files  
✅ **HTTPS only** — Encrypted in transit

---

## GitHub Setup (Step-by-Step)

### Step 1: Create Repository

```bash
# On your computer
mkdir my-music
cd my-music
git init
git config user.email "you@example.com"
git config user.name "Your Name"
```

### Step 2: Add Music Files

```bash
mkdir songs
cp /path/to/your/music/*.mp3 songs/
# Or any audio format: .wav, .m4a, .flac, .ogg
```

### Step 3: Create README

```bash
echo "# My Music Library
This is my personal music collection." > README.md
```

### Step 4: Push to GitHub

```bash
git add .
git commit -m "Initial commit: add music library"
git remote add origin https://github.com/YOUR_USERNAME/my-music.git
git branch -M main
git push -u origin main
```

### Step 5: Use in Player

In the player Settings → Remote Library:
```
https://github.com/YOUR_USERNAME/my-music/tree/main/songs
```

Done! 🎉

---

## Troubleshooting

### "Failed to load remote library"

**Problem:** Invalid URL  
**Solution:** Check URL format:
- ❌ `https://github.com/user/repo` (missing /tree/branch)
- ❌ `https://github.com/user/repo/` (trailing slash)
- ✅ `https://github.com/user/repo/tree/main/songs` (correct)

### "No songs found"

**Problem:** Folder doesn't contain audio files  
**Solution:**
- Check file extensions (.mp3, .wav, .m4a, .flac, .ogg, .aac)
- Verify path is correct (case-sensitive on some servers)
- Ensure GitHub repo is public (not private)

### "Cache not loading"

**Problem:** localStorage cleared  
**Solution:**
- Go to Settings → "Clear Library Cache" → reload
- Or refresh page to re-scan

### "Can't connect to remote server"

**Problem:** CORS or HTTPS issue  
**Solution:**
- Ensure server has HTTPS (required by browsers)
- Check CORS headers allow your domain
- Try testing in Chrome DevTools console

---

## Best Practices

### For GitHub

✅ Keep repo public for easy access  
✅ Organize into folders (artists, albums, playlists)  
✅ Use consistent filenames  
❌ Don't store metadata elsewhere (player handles it)  
❌ Don't upload huge files (GitHub has limits)

### For Web Servers

✅ Use HTTPS always  
✅ Keep manifest.json updated  
✅ Enable CORS if on different domain  
❌ Don't require authentication (player can't handle it)  
❌ Don't block direct downloads

### Cache Management

✅ Let player auto-cache (fast loads)  
✅ Clear cache yearly or if library changes  
✅ Monitor cache size in Settings  
❌ Don't manually edit localStorage (will break)

---

## Storage Size Comparison

### Local Folder (Before)
- Loads: Entire folder scanned each time
- Storage: 0 KB cache
- Refresh: Full rescan (slow)

### With Cache (Now)
- Loads: Instant from cache
- Storage: ~200 KB per 1000 songs
- Refresh: Instant

### Example: 5,000 Song Library
- **Metadata cache:** ~1 MB
- **Audio files:** ~15 GB (NOT cached)
- **Total browser usage:** 1 MB
- **Refresh time:** < 1 second

The cache is incredibly efficient! 🚀

---

## Future Ideas

- ☐ Automatic cache expiration (refresh after 30 days)
- ☐ Multiple library sources (switch between them)
- ☐ Cloud sync (sync cache across devices)
- ☐ Playlist creation from remote library
- ☐ Private repository support (with auth token)

---

That's it! Enjoy your persistent, remote-capable music player! 🎵

Questions? See the main README.md or ARCHITECTURE.md for more details.
