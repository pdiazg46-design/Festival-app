const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const isDev = !app.isPackaged;
    const win = new BrowserWindow({
        width: 1280,
        height: 800,
        title: "Desfoga - Festival Strategy",
        icon: path.join(__dirname, 'public', 'logo.png'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
        backgroundColor: '#0a0a0a',
    });

    if (isDev) {
        win.loadURL('http://localhost:3000');
    } else {
        win.loadURL('http://localhost:3000');
    }

    win.setMenuBarVisibility(false);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
