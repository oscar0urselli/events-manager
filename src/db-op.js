const fs = require('fs');
const path = require('path');
const csv = require('csv');


function copyFile(source, target) {
    fs.copyFile(source, path.join(__dirname, path.join('../', target)), (err) => {
        if (err) return console.error(err);
        console.log('File copied.');
    });
}

function addUser(db, user) {
    let sql = 'INSERT INTO users (name, surname, sex, birthday, cf, city, role, events, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);';
    db.prepare(sql).run([user.name, user.surname, user.sex, user.birthday, user.cf, user.city, user.role, '', 'active']);
    let row = db.prepare('SELECT seq FROM sqlite_sequence WHERE name=?;').get(['users']);
    
    console.log(`A user has been inserted with rowid ${row.seq}`);
    if (user.pic !== '') {
        let img = 'assets/pics/' + String(row.seq) + '.jpg';
        copyFile(user.pic, img);
        db.prepare('UPDATE users SET pic=? WHERE id=?').run([img, row.seq]);
    }

    return 'ok';
}

function getUsers(db) {
    return db.prepare('SELECT * FROM users;').all([]);
}

function getUser(db, id) {
    return db.prepare('SELECT * FROM users WHERE id=?;').get([id]);
}

function delUser(db, id) {
    db.prepare('DELETE FROM users WHERE id=?').run([id]);
    return 'ok';
}

function modifyUser(db, user) {
    let sql = 'UPDATE users SET name=?, surname=?, sex=?, birthday=?, cf=?, city=?, role=? WHERE id=?;';
    db.prepare(sql).run([user.name, user.surname, user.sex, user.birthday, user.cf, user.city, user.role, user.id]);
    
    if (user.pic !== '') {
        let img = 'assets/pics/' + String(user.id) + '.jpg';
        copyFile(user.pic, img);
        db.prepare('UPDATE users SET pic=? WHERE id=?').run([img, user.id]);
    }
    
    return 'ok';
}

function changeUserStatus(db, id, status) {
    db.prepare('UPDATE users SET status=? WHERE id=?;').run([status, id]);

    return 'ok';
}

function takePresence(db, uid, eids) {
    db.prepare('UPDATE users SET events=? WHERE id=?;').run([eids, uid]);

    return 'ok';
}

function exportUsersView(db, conditions) {
    let columns = ['id', 'name', 'surname', 'sex', 'birthday', 'cf', 'city', 'role', 'events', 'status'];
    let writableStream = fs.createWriteStream(path.join(__dirname, '../assets/csv/users-view.csv'));
    let stringifier = csv.stringify({ header: true, columns: columns });

    for (const u of db.prepare('SELECT * FROM users;').iterate([])) {
        if ((u.status === conditions.status || conditions.status === 'undefined') &&
            (u.sex === conditions.sex || conditions.sex === 'undefined') && 
            (u.role === conditions.role || conditions.role === 'undefined') && 
            (u.city === conditions.city || conditions.city === 'undefined') &&
            (u.name.toLowerCase().indexOf(conditions.name) !== -1 || conditions.name === '') &&
            (u.surname.toLowerCase().indexOf(conditions.surname) !== -1 || conditions.surname === '')) {
        
            stringifier.write(u);
        }
    }
    stringifier.pipe(writableStream);

    return 'ok';
}


function addEvent(db, event) {
    let sql = 'INSERT INTO events (name, description, notes, start_datetime, end_datetime, site, users) VALUES (?, ?, ?, ?, ?, ?, ?);';
    db.prepare(sql).run([event.name, event.description, event.notes, event.start_datetime, event.end_datetime, event.site, event.users]);

    return 'ok';
}

function getEvents(db) {
    return db.prepare('SELECT * FROM events;').all([]);
}

function delEvent(db, id) {
    db.prepare('DELETE FROM events WHERE id=?').run([id]);
    return 'ok';
}

function modifyEvent(db, event) {
    let sql = 'UPDATE events SET name=?, description=?, notes=?, start_datetime=?, end_datetime=?, site=?, users=? WHERE id=?';
    db.prepare(sql).run([event.name, event.description, event.notes, event.start_datetime, event.end_datetime, event.site, event.users, event.id]);

    return 'ok';
}

function exportEventsView(db, conditions) {
    let sql = 'SELECT * FROM events;';

    let columns = ['id', 'name', 'description', 'notes', 'start_datetime', 'end_datetime', 'site', 'users'];
    let writableStream = fs.createWriteStream(path.join(__dirname, '../assets/csv/events-view.csv'));
    let stringifier = csv.stringify({ header: true, columns: columns });

    let nowDatetime = new Date().getTime();
    for (const row of db.prepare(sql).iterate([])) {
        if (((conditions.status === '1' && nowDatetime > row.start_datetime && nowDatetime < row.end_datetime) ||
            (conditions.status === '2' && nowDatetime > row.end_datetime) ||
            (conditions.status === '3' && nowDatetime < row.start_datetime) ||
            (conditions.status === 'undefined')) &&
            ((conditions.dateType === '1' && row.end_datetime < conditions.date) ||
            (conditions.dateType === '2' && row.start_datetime > conditions.date) ||
            (conditions.dateType === 'undefined' || conditions.date === ''))) {
            
            stringifier.write(row);
        }
    }
    stringifier.pipe(writableStream);

    return 'ok';
}


module.exports.addUser = addUser;
module.exports.getUsers = getUsers;
module.exports.getUser = getUser;
module.exports.delUser = delUser;
module.exports.modifyUser = modifyUser;
module.exports.changeUserStatus = changeUserStatus;
module.exports.takePresence = takePresence;
module.exports.exportUsersView = exportUsersView;

module.exports.addEvent = addEvent;
module.exports.getEvents = getEvents;
module.exports.delEvent = delEvent;
module.exports.modifyEvent = modifyEvent;
module.exports.exportEventsView = exportEventsView;