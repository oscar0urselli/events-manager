const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('db', {
    addUser: (user) => ipcRenderer.invoke('addUser', user),
    getUsers: () => ipcRenderer.invoke('getUsers'),
    delUser: (id) => ipcRenderer.invoke('delUser', id),
    modifyUser: (user) => ipcRenderer.invoke('modifyUser', user)
});
contextBridge.exposeInMainWorld('misc', {
    viewUserInfo: (user) => ipcRenderer.invoke('viewUserInfo', user)
});