const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('db', {
    addUser: (user) => ipcRenderer.invoke('addUser', user),
    getUsers: () => ipcRenderer.invoke('getUsers'),
    getUser: (id) => ipcRenderer.invoke('getUser', id),
    delUser: (id) => ipcRenderer.invoke('delUser', id),
    modifyUser: (user) => ipcRenderer.invoke('modifyUser', user),
    changeUserStatus: (id, status) => ipcRenderer.invoke('changeUserStatus', id, status),
    
    addEvent: (event) => ipcRenderer.invoke('addEvent', event),
    getEvents: () => ipcRenderer.invoke('getEvents'),
    delEvent: (id) => ipcRenderer.invoke('delEvent', id),
    modifyEvent: (event) => ipcRenderer.invoke('modifyEvent', event)
});
contextBridge.exposeInMainWorld('misc', {
    viewUserInfo: (user) => ipcRenderer.invoke('viewUserInfo', user),
    viewEventInfo: (e) => ipcRenderer.invoke('viewEventInfo', e)
});