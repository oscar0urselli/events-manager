const { remote, ipcRenderer } = require('electron');


function getCurrentWindow() {
    return remote.getCurrentWindow();
}

function openMenu(x, y) {
    ipcRenderer.send('display-app-menu', { x, y });
}

function minimizeWindow(browserWindow = getCurrentWindow()) {
    if (browserWindow.minimizable) {
        browserWindow.minimize();
    }
}

function maximizeWindow(browserWindow = getCurrentWindow()) {
    if (browserWindow.maximizable) {
        browserWindow.maximize();
    }
}

function unmaximizeWindow(browserWindow = getCurrentWindow()) {
    browserWindow.unmaximize();
}

function isWindowMaximized(browserWindow = getCurrentWindow()) {
    return browserWindow.isMaximized();
}

module.exports = {
    getCurrentWindow,
    openMenu,
    minimizeWindow,
    maximizeWindow,
    isWindowMaximized
};