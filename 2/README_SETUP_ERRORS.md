# Errors & Solutions

## You Got CORS Errors? Here's What Happened

### The Errors You Saw

```
Origin null is not allowed by Access-Control-Allow-Origin
TypeError: window.showDirectoryPicker is not a function
```

### Why This Happened

When you opened `music-player.html` directly from your computer by clicking it:
- Browser treated it as `file://` (local file origin)
- File System Access API **requires** `http://` or `https://` (security feature)
- CORS (Cross-Origin Resource Sharing) blocked the manifest.json file
- `showDirectoryPicker()` function not available in `file://` context

This is **intentional browser security** — to prevent malicious websites from accessing your local files.

---

## The Solution: Two Options

### Option A: Quick Start (No Setup Needed) ✅

Use `music-player-offline.html` instead.

This version:
- Works with `file://` URLs
- Opens immediately
- Let's you add audio files manually
- No folder access (you select individual files)
- No metadata extraction

**How to use:**
1. Double-click `music-player-offline.html`
2. Click "📁 Add Songs"
3. Select audio files
4. Done!

---

### Option B: Full Features (Requires Simple Setup)

Use `music-player.html` with a local web server.

**Why you need this:** File System Access API requires `http://localhost`

**Setup takes 1 minute:**

#### Mac/Linux Terminal
```bash
cd /path/to/Music\ Player
python3 -m http.server 8000
```

Then open: **http://localhost:8000**

#### Windows Command Prompt
```bash
cd C:\path\to\Music Player
python -m http.server 8000
```

Then open: **http://localhost:8000**

#### VS Code (Easiest)
1. Install "Live Server" extension
2. Right-click `index.html` → "Open with Live Server"
3. Browser opens automatically

---

## Why Not Just Use the Quick Start?

Both work! But **Full Version** is better for:
- **Large music libraries** (100+ songs)
- **iTunes libraries** (auto-scans folders)
- **Metadata** (shows artist, album, year, genre)
- **Advanced filtering** (search by genre/year/artist)
- **Phone integration** (add to home screen as PWA)
- **Device controls** (lock screen buttons)

---

## Common Issues & Fixes

### "Still getting CORS errors"

**Make sure:**
1. ✅ You're opening `http://localhost:8000` (not `file://`)
2. ✅ The terminal shows "Serving on..." message
3. ✅ The terminal is still running (don't close it)
4. ✅ You waited a moment for the page to load

If still broken:
1. Stop the server: Press `Ctrl+C` in terminal
2. Start again: `python3 -m http.server 8000`
3. Refresh the page: `Cmd+R` or `Ctrl+R`

---

### "showDirectoryPicker is not a function"

This happens in `file://` context.

**Solutions:**
1. Use `music-player-offline.html` (works on file://)
2. Use a local server for `music-player.html`
3. Try a different browser (all modern ones support it when on http://)

---

### "Python not found" (Windows)

If you don't have Python:

**Option 1: Use Node.js**
```bash
npx http-server
```

**Option 2: Use VS Code Live Server** (recommended)
1. Install VS Code
2. Install "Live Server" extension
3. Right-click `index.html` → "Open with Live Server"

**Option 3: Install Python**
- Download from python.org
- Run installer with "Add to PATH" checked

---

### "Port 8000 already in use"

Another program is using port 8000.

Try a different port:
```bash
python3 -m http.server 8001
```

Then open `http://localhost:8001`

---

## Which Version Should I Use?

| Situation | Use This |
|-----------|----------|
| "I want to play music right now" | `music-player-offline.html` |
| "I have a large music library" | `music-player.html` + server |
| "I don't want to set anything up" | `music-player-offline.html` |
| "I want folder access & metadata" | `music-player.html` + server |
| "I want to use on my iPhone" | `music-player.html` + server |

---

## Complete Setup Walkthrough

### For Full Version (Folder Access)

**Mac:**
```bash
# Open Terminal
cd /path/to/Music\ Player

# Start server
python3 -m http.server 8000

# You'll see:
# Serving HTTP on 0.0.0.0 port 8000 ...
```

Then:
1. Open web browser
2. Go to `http://localhost:8000`
3. Click "Open Music Player"
4. Click "📁 Select" button
5. Grant folder access
6. Select your music folder

**Windows:**
```bash
# Open Command Prompt
cd C:\path\to\Music Player

# Start server
python -m http.server 8000

# You'll see:
# Serving HTTP on 0.0.0.0 port 8000 ...
```

Then follow same browser steps as Mac.

---

## Keep the Server Running

Once you've started the server in terminal/command prompt:
- **Leave that window open** while using the player
- The player will work as long as the server is running
- When done, press **Ctrl+C** to stop

You only need to do this setup once per session.

---

## Next Steps

1. **Choose your version:**
   - Quick Start: Open `music-player-offline.html`
   - Full: Follow setup above, then open `music-player.html`

2. **Read the guide:**
   - `WHICH_VERSION.md` — Comparison of both versions
   - `QUICK_START.md` — Quick user guide
   - `README.md` — Complete documentation

3. **Enjoy your music!** 🎵

---

## Still Stuck?

Check this checklist:

- ✅ Using correct file (`offline` vs `html`)
- ✅ Server is running (for full version)
- ✅ Browser is at `http://localhost` (not `file://`)
- ✅ Port is open (8000, 8001, 8080, 5500)
- ✅ All files are in the same folder
- ✅ Using modern browser (Chrome, Safari, Firefox, Edge)

If it's still not working, try the Quick Start version — it works immediately with no setup.
