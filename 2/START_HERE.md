# How to Run the Music Player (Local Server Setup)

## The Issue

Opening `music-player.html` directly from disk (as `file://`) doesn't work because:
- File System Access API requires HTTPS or `localhost`
- Manifest.json loading blocked by CORS
- Security restrictions prevent local folder access

## The Solution: Start a Local Server

You have several easy options. Pick one:

---

## Option 1: Python (Built-in on Mac/Linux)

### macOS/Linux
```bash
cd /path/to/Music Player
python3 -m http.server 8000
```

### Windows (if Python installed)
```bash
cd C:\path\to\Music Player
python -m http.server 8000
```

Then open: **http://localhost:8000**

---

## Option 2: Node.js (if installed)

```bash
cd /path/to/Music Player
npx http-server
```

Then open the URL it shows (usually **http://localhost:8080**)

---

## Option 3: VS Code (Easiest for Developers)

1. Open the Music Player folder in VS Code
2. Install the **"Live Server"** extension (search in Extensions tab)
3. Right-click `index.html` → **"Open with Live Server"**
4. Browser opens automatically at `http://localhost:5500`

---

## Option 4: Use a Real Web Server

If hosting on a web server, ensure:
- URL uses **HTTPS** (File System Access API requires it)
- All files are uploaded (HTML, JS, CSS, manifest.json)
- Server supports `.json` file serving

---

## Option 5: Create a Simple Batch/Shell Script

### macOS/Linux: Create `start.sh`

```bash
#!/bin/bash
cd "$(dirname "$0")"
python3 -m http.server 8000 &
sleep 1
open http://localhost:8000
echo "Music Player opened at http://localhost:8000"
echo "Press Ctrl+C to stop the server"
wait
```

Make it executable:
```bash
chmod +x start.sh
```

Run it:
```bash
./start.sh
```

### Windows: Create `start.bat`

```batch
@echo off
cd /d "%~dp0"
python -m http.server 8000
pause
```

Double-click `start.bat` to run.

---

## Once the Server is Running

1. Open your browser to **http://localhost:8000** (or the URL shown)
2. Click "Open Music Player"
3. Click the green "📁 Select" button
4. Grant folder access when prompted
5. Select your music folder and enjoy! 🎵

---

## Recommended: Option 1 (Python)

It's the quickest:

```bash
cd /path/to/Music\ Player
python3 -m http.server 8000
# Open http://localhost:8000 in your browser
# Keep terminal running while using the player
# Press Ctrl+C to stop
```

---

## Why This Works

- `http://localhost` counts as a **secure context**
- File System Access API is now **allowed**
- Manifest.json **loads properly**
- You can **select folders** on your device
- Everything still works **offline** once loaded

---

## Keep the Server Running

Leave the terminal/command prompt window open while using the player. When you're done:

- Press **Ctrl+C** in the terminal to stop the server

---

## Still Having Issues?

Try this checklist:

- ✅ Server is running (check terminal for "Serving on..." message)
- ✅ Browser is on `http://` (not `file://`)
- ✅ Port is 8000, 8080, or 5500 (whatever your server uses)
- ✅ All files are in the same folder
- ✅ Using a modern browser (Chrome, Safari, Firefox, Edge)

---

## For Production/Sharing

If you want to share this player with others or deploy it:

1. Upload to a **web server** with **HTTPS enabled**
2. Users access it via the HTTPS URL
3. They can select their own local folders
4. Everything still works **offline** after first load

---

That's it! Your music player is ready once you start a local server. 🎵
