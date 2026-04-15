# 🎵 Get Started in 30 Seconds

## Pick Your Path

### Path A: Quick Start (Recommended for First-Time Use)
**Works immediately, no setup needed.**

1. Open the folder you downloaded
2. **Double-click `music-player-offline.html`**
3. Click "📁 Add Songs"
4. Select your audio files
5. Click a song to play

✅ **Takes 10 seconds**  
✅ **Works right now**  
⚠️ **Limited to manually-selected files**

---

### Path B: Full Features (For Music Libraries)
**Folder access, metadata, advanced filters, PWA mode.**

#### Setup (Pick One Method)

**Method 1: Python (Mac/Linux/Windows)**
```bash
cd /path/to/Music\ Player
python3 -m http.server 8000
```

**Method 2: VS Code (Any OS)**
1. Install "Live Server" extension in VS Code
2. Right-click `index.html` → "Open with Live Server"

**Method 3: Node.js (If Installed)**
```bash
npx http-server
```

#### Then Open
1. Browser automatically opens, OR
2. Go to **http://localhost:8000**
3. Click "Open Music Player"
4. Click "📁 Select"
5. Choose your music folder
6. Done!

✅ **Works with entire folders**  
✅ **Shows artist/album/year metadata**  
✅ **Phone home screen app**  
⚠️ **Requires 30-second setup**

---

## File Guide

### To Play Music Right Now
→ **`music-player-offline.html`**

### For Full Features (Folder Access, Metadata)
→ **`music-player.html`** (start server first)

### Landing Page
→ **`index.html`**

### Documentation
- `WHICH_VERSION.md` — Compare both versions
- `README_SETUP_ERRORS.md` — Fix CORS errors
- `START_HERE.md` — Setup full version detailed
- `README.md` — Complete user guide
- `ARCHITECTURE.md` — Technical details

---

## Troubleshooting

### "CORS errors" or "showDirectoryPicker not found"
→ You're trying to use Full Version on `file://`  
→ **Solution:** Use Path A (Quick Start) or set up Path B (server)

### "Page won't load"
→ Server not running or wrong URL  
→ **Check:** Terminal shows "Serving on..." message?

### "Can't select folders"
→ Using Quick Start version (that's normal)  
→ **Try:** Path B (Full Version) instead

### "Only works with 1 file at a time"
→ Using Quick Start version  
→ **Try:** Path B (Full Version) instead

---

## What Works Where

| Feature | Quick Start | Full Version |
|---------|:-----------:|:------------:|
| **Start immediately** | ✅ | ❌ |
| **Folder access** | ❌ | ✅ |
| **Large libraries** | ❌ | ✅ |
| **Metadata** | ❌ | ✅ |
| **Filters** | ❌ | ✅ |
| **Phone app** | ❌ | ✅ |
| **Setup required** | ❌ | ✅ |

---

## Quick Answers

**Q: Which should I use?**  
A: Start with Quick Start. Switch to Full Version if you have a music library.

**Q: Why do I get CORS errors?**  
A: File System Access API needs a server. Use Quick Start or set up server.

**Q: Can I use both?**  
A: Yes! They're separate. Use whichever fits your need.

**Q: How do I install on my phone?**  
A: Use Full Version, add to home screen (Settings tab in app).

**Q: Do I need internet?**  
A: No. Works fully offline. Just need server once to start.

**Q: How many songs can it handle?**  
A: Quick Start: ~100. Full Version: 10,000+

**Q: Does it delete my songs?**  
A: No. Reads files only. You control what's selected.

**Q: Can I share this with friends?**  
A: Yes. They use Quick Start immediately, or you upload to web server for Full Version.

---

## Next Steps

1. **Right now:** Open `music-player-offline.html`
2. **Add some songs** to test it
3. **If you like it:** Try Full Version (`music-player.html`) with server
4. **Read docs** if you want to understand features

---

## You're All Set! 🎵

Your music player is ready. No installation, no accounts, no tracking.

**Enjoy!**
