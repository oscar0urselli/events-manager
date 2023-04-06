const path = require('path');
const fs = require('fs');
const { app, BrowserWindow, ipcMain } = require('electron');
const Database = require('better-sqlite3'); //require('sqlite3').verbose();
const db_op = require('./src/db-op');
const menu = require('./src/menu-function');

if (require('electron-squirrel-startup')) app.quit();

let db = null; 

try {
    db = new Database(path.join(__dirname, './database.db'), { fileMustExist: true, verbose: console.log });
}
catch (error) {
    console.error(error);

    let dbExists = false;
    if (fs.existsSync(path.join(__dirname, 'src/backup-database.db'))) {
        fs.copyFileSync(path.join(__dirname, 'src/backup-database.db'), path.join(__dirname, './database.db'));
        dbExists = true;
    }

    db = new Database(path.join(__dirname, './database.db'), { verbose: console.log });
    if (!dbExists) {
        db.prepare(`CREATE TABLE users (
            id       INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            name     TEXT,
            surname  TEXT,
            sex      TEXT,
            birthday TEXT,
            cf       TEXT,
            city     TEXT,
            role     TEXT,
            events   TEXT,
            pic      TEXT,
            status   TEXT
        );`).run([]);
        db.prepare(`CREATE TABLE events (
            id             INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            name           TEXT,
            description    TEXT,
            notes          TEXT,
            start_datetime INTEGER,
            end_datetime   INTEGER,
            site           TEXT,
            users          TEXT,
            test           BLOB
        );`).run([]);
    }
}

db.pragma('journal_mode = WAL');
console.log('Connected to the SQlite database.');
var viewUser = undefined;
var viewEvent = undefined;


const createWindow = () => {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'src/preload.js'),
        },
        frame: false
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
    ipcMain.handle('getEvent', (event, id) => { return db_op.getEvent(db, id); });
    ipcMain.handle('delEvent', (event, id) => { return db_op.delEvent(db, id); });
    ipcMain.handle('modifyEvent', (event, e) => { return db_op.modifyEvent(db, e); });
    ipcMain.handle('exportEventsView', (event, conditions) => { return db_op.exportEventsView(db, conditions); });

    ipcMain.handle('viewUserInfo', (event, user) => { let u = viewUser; viewUser = user; return u; });
    ipcMain.handle('viewEventInfo', (event, e) => { let ev = viewEvent; viewEvent = e; return ev; });

    ipcMain.handle('exportDB', async (event) => {
        let res;
        await db.backup(path.join(__dirname, 'src/backup-database.db'))
        .then(() => {
            console.log('Backup completed.');
            res = 'ok';
        })
        .catch((err) => {
            console.error('Backup failed', err);
            res = 'no';
        });
        console.log(res);
        return res;
    });
    ipcMain.handle('importDB', async (event, DBpath) => {
        try {
            await db.backup(path.join(__dirname, 'src/backup-database.db'));

            await db.close();

            fs.copyFileSync(DBpath, path.join(__dirname, '/database.db'));
            db = new Database(path.join(__dirname, './database.db'), { fileMustExist: true, verbose: console.log });
            db.pragma('journal_mode = WAL');

            return 'ok';
        }
        catch (err) {
            fs.copyFileSync(path.join(__dirname, 'src/backup-database.db'), path.join(__dirname, './database.db'));
            db = new Database(path.join(__dirname, './database.db'), { verbose: console.log });
            db.pragma('journal_mode = WAL');

            return 'no';
        }
    });

    // Window frame functions
    ipcMain.handle('closeWindow', (event) => { win.close() });
    ipcMain.handle('maxUnmaxWindow', (event) => {
        if (win.isMaximized()) {
            win.unmaximize();
        }
        else {
            win.maximize();
        }
    });
    ipcMain.handle('minimizeWindow', (event) => {
        if (win.maximizable) {
            win.maximize();
        }
        if (win.minimizable) {
            win.minimize();
        }
    });

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
    db.backup(path.join(__dirname, 'src/backup-database.db'))
        .then(() => {
            console.log('Backup completed.');
        })
        .catch((err) => {
            console.log('Backup failed', err);
        })
        .finally(() => {
            db.close();

            if (process.platform !== 'darwin') {
                app.quit();
            }
        });
});