const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
const Database = require('better-sqlite3'); //require('sqlite3').verbose();
const db_op = require('./src/db-op');


const db = new Database(path.join(__dirname, './test.db'), { verbose: console.log });
db.pragma('journal_mode = WAL');
console.log('Connected to the SQlite database.');
var viewUser = undefined;


const createWindow = () => {
    const win = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, 'src/preload.js')
        }
    });
    
    ipcMain.handle('addUser', (event, user) => { return db_op.addUser(db, user); });
    ipcMain.handle('getUsers', (event) => { return db_op.getUsers(db); });
    ipcMain.handle('delUser', (event, id) => { return db_op.delUser(db, id); });
    ipcMain.handle('modifyUser', (event, user) => { return db_op.modifyUser(db, user); });
    ipcMain.handle('viewUserInfo', (event, user) => { let u = viewUser; viewUser = user; return u;});
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