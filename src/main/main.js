const { app, BrowserWindow } = require('electron')
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

(async () => {
    await app.whenReady();
    await createWindow();
})();

async function createWindow (){
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        icon: path.join(__dirname, '..', '..', 'assets', 'icons', '128x128.png'),
    })
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
