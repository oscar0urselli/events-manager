const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
const sqlite3 = require('sqlite3').verbose();



const db = new sqlite3.Database(path.join(__dirname, './test.db'), (err) => {
    if (err) return console.error(err.message);

    console.log('Connected to the SQlite database.');
    console.log('Check database integrity...');
    db.get('SELECT name FROM sqlite_master WHERE type=\'table\' AND name=?', ['users'], (err, row) => {
        if (err) return console.error(err.message);

        if (row === undefined) {
            console.warn('Tables not found, I recreated them.')
            db.run(`CREATE TABLE users(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                surname TEXT,
                sex TEXT,
                birthday TEXT,
                cf TEXT,
                city TEXT,
                role TEXT,
                events TEXT,
                pic TEXT
            );`)
            .run(`CREATE TABLE events(
                id INTEGER PRIMARY KET AUTOINCREMENT,
                name TEXT,
                description TEXT,
                notes TEXT,
                start_datetime TEXT,
                end_datetime TEXT,
                site TEXT,
                users TEXT,
                status TEXT
            );`);
        }
        else {
            console.log('OK')
        }
    });
});


const createWindow = () => {
    const win = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, 'src/preload.js')
        }
    });
    ipcMain.handle('addUser', (event, user) => {
        console.log(user);
        return 'ok';
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
    if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
    db.close((err) => {
        if (err) return console.error(err.message);

        console.log('Close the database connection.');
    });
});