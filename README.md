# Stream Deck (GitHub Pages Version)

A web-based stream deck app with media control buttons.

## Features

- 🔊 Volume Up/Down (demo audio)
- 🔇 Mute/Unmute (demo audio)
- ⏯️ Play/Pause
- ⏭️ Next Track
- ⏮️ Previous Track

## Usage

Simply open `index.html` in your browser or visit the GitHub Pages site.

**Note:** Due to browser security limitations, this version demonstrates volume controls on a demo audio element and registers media session handlers. It cannot directly control system volume or media playback.

For full system control on macOS, see the [V1 branch](../../tree/V1) which uses a Node.js server with AppleScript.

## Branches

- **pages** - Static HTML version for GitHub Pages (current branch)
- **V1** - Node.js server version with full macOS system control