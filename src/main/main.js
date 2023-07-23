const { app, BrowserWindow, ipcMain } = require('electron')
const {URL} = require("url");
const path = require("path");

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        (async() =>{await createWindow()})();
    }
});

ipcMain.handle('load-dependencies', async (_event) => {
    const dependencies = require('../../package.json').devDependencies;
    return Object.entries(dependencies).map(([key, value]) => {
        return {
            name: key,
            version: value
        };
    });
});


(async () => {
    await app.whenReady();
    await createWindow();
})();

async function createWindow (){
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        icon: path.join(__dirname, '..', '..', 'assets', 'icons', '128x128.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    ipcMain.on('set-title', (_event, title) => {
        win.setTitle(title);
    });

    ipcMain.on('request-greeting', (_event, greeting) => {
        win.webContents.send('greeting', `Hello: ${greeting}`)
    });

    await win.loadURL(
        process.env.NODE_ENV === 'development' ? getDevelopmentFileUrl() : getProductionFileUrl()
    );
}

function getDevelopmentFileUrl() {
    return new URL(`http://localhost:${process.env.PORT || 3000}/index.html`).href
}

function getProductionFileUrl () {
    return `file://${path.join(__dirname, '..', 'renderer', 'index.html')}`;
}
