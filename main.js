const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
const Database = require('better-sqlite3'); //require('sqlite3').verbose();
const db_op = require('./src/db-op');


const db = new Database(path.join(__dirname, './test.db'), { verbose: console.log });
db.pragma('journal_mode = WAL');
console.log('Connected to the SQlite database.');
var viewUser = undefined;
var viewEvent = undefined;


const createWindow = () => {
    const win = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, 'src/preload.js')
        }
    });
    
    ipcMain.handle('addUser', (event, user) => { return db_op.addUser(db, user); });
    ipcMain.handle('getUsers', (event) => { return db_op.getUsers(db); });
    ipcMain.handle('getUser', (event, id) => { return db_op.getUser(db, id); });
    ipcMain.handle('delUser', (event, id) => { return db_op.delUser(db, id); });
    ipcMain.handle('modifyUser', (event, user) => { return db_op.modifyUser(db, user); });
    ipcMain.handle('changeUserStatus', (event, id, status) => { return db_op.changeUserStatus(db, id, status); });
    ipcMain.handle('takePresence', (event, uid, eids) => { return db_op.takePresence(db, uid, eids); });
    ipcMain.handle('exportUsersView', (event, conditions) => { return db_op.exportUsersView(db, conditions); });

    ipcMain.handle('addEvent', (event, e) => { return db_op.addEvent(db, e); });
    ipcMain.handle('getEvents', (event) => { return db_op.getEvents(db); });
    ipcMain.handle('delEvent', (event, id) => { return db_op.delEvent(db, id); });
    ipcMain.handle('modifyEvent', (event, e) => { return db_op.modifyEvent(db, e); });
    ipcMain.handle('exportEventsView', (event, conditions) => { return db_op.exportEventsView(db, conditions); });

    ipcMain.handle('viewUserInfo', (event, user) => { let u = viewUser; viewUser = user; return u; });
    ipcMain.handle('viewEventInfo', (event, e) => { let ev = viewEvent; viewEvent = e; return ev; });

    win.loadFile(path.join(__dirname, '/assets/html/home.html'));
}

app.on('will-finish-launching', () => {
    
});

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
    db.close((err) => {
        if (err) return console.error(err.message);

        console.log('Close the database connection.');
    });
});