const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('db', {
    addUser: (user) => ipcRenderer.invoke('addUser', user),
    getUsers: () => ipcRenderer.invoke('getUsers'),
    getUser: (id) => ipcRenderer.invoke('getUser', id),
    delUser: (id) => ipcRenderer.invoke('delUser', id),
    modifyUser: (user) => ipcRenderer.invoke('modifyUser', user),
    changeUserStatus: (id, status) => ipcRenderer.invoke('changeUserStatus', id, status),
    takePresence: (uid, eids) => ipcRenderer.invoke('takePresence', uid, eids),
    exportUsersView: (conditions) => ipcRenderer.invoke('exportUsersView', conditions),
    
    addEvent: (event) => ipcRenderer.invoke('addEvent', event),
    getEvents: () => ipcRenderer.invoke('getEvents'),
    getEvent: (id) => ipcRenderer.invoke('getEvent', id),
    delEvent: (id) => ipcRenderer.invoke('delEvent', id),
    modifyEvent: (event) => ipcRenderer.invoke('modifyEvent', event),
    exportEventsView: (conditions) => ipcRenderer.invoke('exportEventsView', conditions)
});
contextBridge.exposeInMainWorld('misc', {
    viewUserInfo: (user) => ipcRenderer.invoke('viewUserInfo', user),
    viewEventInfo: (e) => ipcRenderer.invoke('viewEventInfo', e)
});