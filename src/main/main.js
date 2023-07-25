const { app, BrowserWindow, ipcMain, session} = require('electron')
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

if (process.env.NODE_ENV === 'development') {
    // Set Chromium log level to "fatal" (3) to suppress warnings about React Dev Tools. These would be printed in
    // the console every time the dev tools are opened in the BrowserWindow.
    // https://chromium.googlesource.com/chromium/src/+/HEAD/base/logging.h#376
    app.commandLine.appendSwitch('log-level', '3');
}

(async () => {
    await app.whenReady();
    await createWindow();
})();

async function createWindow (){
    if (process.env.NODE_ENV === 'development') {
        await installReactDevTools();
    }

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

async function installReactDevTools() {
    // This will cause:
    // "Manifest version 2 is deprecated, and support will be removed in 2023. See https://developer.chrome.com/blog/mv2-transition/ for more details."
    // in the console every time the main process is started.
    //
    // As far as I know, it is the only way to get React Dev Tools to work with current Electron. I have not found a way to suppress the warning.
    // Please leave a PR if you know how to get rid of the warning.
    //
    // There are also libraries for doing this, like https://github.com/jonluca/electron-extension-installer, but they basically do the same thing with the
    // exception that they download the extension from a custom server.

    // https://github.com/electron/electron/issues/37876
    // https://github.com/facebook/react/issues/25843
    const extensionOptions = {
        allowFileAccess: true,
    };
    await session.defaultSession.loadExtension(
        path.join(__dirname, '../../workarounds/react-dev-tools'),
        extensionOptions
    );
}