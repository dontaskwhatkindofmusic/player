# Which Version Should You Use?

## Quick Answer

- **Want to start playing music right now?** → Use **`music-player-offline.html`** ✅
- **Want folder access, metadata extraction, and advanced filters?** → Use **`music-player.html`** + follow **`START_HERE.md`** 🚀

---

## Side-by-Side Comparison

| Feature | Quick Start | Full Version |
|---------|-------------|--------------|
| **Setup required** | None ❌ | Yes, start a local server ✅ |
| **Works on `file://`** | Yes ✅ | No, needs http://localhost ❌ |
| **Select entire folders** | No ❌ | Yes ✅ |
| **Auto-scan subdirectories** | No ❌ | Yes ✅ |
| **Metadata extraction** | No ❌ | Yes (ID3, M4A) ✅ |
| **Advanced filters** | No ❌ | Yes (artist/genre/year) ✅ |
| **Lock screen controls** | No ❌ | Yes ✅ |
| **PWA installable** | No ❌ | Yes ✅ |
| **Shuffle/repeat** | Yes ✅ | Yes ✅ |
| **Search** | Basic ✅ | Yes ✅ |
| **Works offline** | After opening ✅ | After opening ✅ |
| **File limit** | Practical limit ~1000 files | Handles 10,000+ songs ✅ |

---

## Quick Start Version

### What It Does
- Add audio files one at a time (or select multiple at once)
- Play, pause, skip, search
- No setup needed — works immediately

### How to Use
1. Click `music-player-offline.html` to open
2. Click "📁 Add Songs"
3. Select one or more audio files
4. Click a song to play

### Good For
- Testing quickly
- Small collections (< 100 songs)
- When you don't want to bother with server setup
- Quick access to a few favorite songs

### Limitations
- Must manually select files
- No folder scanning (can't load entire iTunes library at once)
- No metadata (shows filename instead of artist/album)
- No advanced filters
- No lock screen controls

---

## Full Version

### What It Does
- Select an entire folder with music
- Automatically finds all songs in subdirectories
- Extracts artist, album, year, genre from file metadata
- Advanced filtering and sorting
- Device control integration (lock screen buttons)
- PWA mode for phones
- Handles large libraries (thousands of songs)

### How to Use
1. Follow `START_HERE.md` to start a local server
2. Open `music-player.html` at `http://localhost:8000`
3. Click "📁 Select" button
4. Grant folder access
5. Choose your music folder (e.g., iTunes library)
6. Enjoy!

### Good For
- Serious music collections (100+ songs)
- iTunes libraries
- Want proper metadata (artist/album)
- Want advanced filtering
- Want device controls
- Want to use on phone with home screen app

### Requirements
- Local web server running (Python, Node, VS Code Live Server, etc.)
- Modern browser with File System Access API support
- Takes ~30 seconds to set up

---

## Recommended Setup

### For Casual Use (Get Started Now)
→ Use **Quick Start** (`music-player-offline.html`)

### For Music Library Management (Better Experience)
→ Use **Full Version** (`music-player.html`)

**Why?** The Full Version is worth the 1-minute server setup because:
- Loads your entire iTunes library at once
- Shows proper artist/album/year metadata
- Filters by genre, year, artist
- Works on your phone with PWA
- Better for discovering music

---

## Setting Up the Full Version (30 Seconds)

### On Mac/Linux
```bash
cd /path/to/Music\ Player
python3 -m http.server 8000
# Open http://localhost:8000 in your browser
```

### On Windows
```bash
cd C:\path\to\Music Player
python -m http.server 8000
# Open http://localhost:8000 in your browser
```

### Using VS Code
1. Install "Live Server" extension
2. Right-click `index.html`
3. Select "Open with Live Server"
4. Done!

---

## Frequently Asked Questions

### Can I upgrade from Quick Start to Full Version later?
Yes! Quick Start is just a different file. The Full Version data is separate. You can use both independently.

### Does Quick Start work offline?
Yes, but you have to manually add files each time. The full version caches the library better.

### Can I use the Full Version without a server?
Not easily. File System Access API requires HTTPS or localhost for security reasons. The Quick Start works around this.

### Which one should I share with friends?
- **Quick Start** if they just want to play a few songs
- **Full Version** if they have a music library and can run a server

For sharing: Upload to a web server with HTTPS, and users can use it without any server setup on their end.

### Is there a mobile version?
Both work on mobile!
- **Quick Start**: Use as-is in any browser
- **Full Version**: Better on mobile — add to home screen for PWA mode

---

## Pro Tips

### Quick Start Power User Moves
- Drag multiple files at once
- Create a folder of favorite songs
- Use browser bookmarks to save the player

### Full Version Power User Moves
- Point it to your entire iTunes library
- Use filters to find music by era or genre
- Add to phone home screen for native app experience
- Use lock screen controls while device is locked

---

## Conclusion

**Start with Quick Start** if you want instant gratification.  
**Use Full Version** if you have a real music library you want to manage.

Either way, you're up and running in seconds! 🎵

---

Still have questions? See `README.md` for detailed documentation.
