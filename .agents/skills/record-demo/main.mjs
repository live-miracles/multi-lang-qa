// Tiny Electron entry for record.mjs: opens the demo server's page.
// (A URL passed on record.mjs's command line crashes Electron on Windows, so it lives here.)
import electron from 'electron';
const { app, BrowserWindow } = electron;
app.whenReady().then(() => {
    const w = new BrowserWindow({ width: 1100, height: 720, show: true });
    w.setMenuBarVisibility(false);
    w.loadURL('http://localhost:5199');
});
