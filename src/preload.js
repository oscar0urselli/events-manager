const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('db', {
    addUser: (user) => ipcRenderer.invoke('addUser', user),
    getUsers: () => ipcRenderer.invoke('getUsers')
});