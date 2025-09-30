#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 3000;

// macOS AppleScript commands for volume control
const commands = {
    'volume-up': 'osascript -e "set volume output volume (output volume of (get volume settings) + 10)"',
    'volume-down': 'osascript -e "set volume output volume (output volume of (get volume settings) - 10)"',
    'mute': 'osascript -e "set volume output muted (not (output muted of (get volume settings)))"',
    'play-pause': 'osascript -e "tell application \\"System Events\\" to keystroke space"',
    'next': 'osascript -e "tell application \\"System Events\\" to key code 124 using {command down}"',
    'previous': 'osascript -e "tell application \\"System Events\\" to key code 123 using {command down}"'
};

function executeCommand(action) {
    return new Promise((resolve, reject) => {
        const command = commands[action];
        if (!command) {
            reject(new Error('Unknown action'));
            return;
        }

        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve(stdout);
            }
        });
    });
}

const server = http.createServer(async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Serve the HTML file
    if (req.url === '/' || req.url === '/index.html') {
        const htmlPath = path.join(__dirname, 'stream-deck.html');
        fs.readFile(htmlPath, (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading page');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
        return;
    }

    // Handle API actions
    if (req.url === '/api/action' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const { action } = JSON.parse(body);
                await executeCommand(action);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, action }));
                console.log(`✓ Executed: ${action}`);
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: error.message }));
                console.error(`✗ Error: ${error.message}`);
            }
        });
        return;
    }

    // 404
    res.writeHead(404);
    res.end('Not found');
});

server.listen(PORT, () => {
    console.log(`\n🎛️  Stream Deck Server Running!\n`);
    console.log(`   Open in browser: http://localhost:${PORT}\n`);
    console.log(`   Press Ctrl+C to stop\n`);
});