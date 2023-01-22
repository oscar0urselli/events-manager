const fs = require('fs');
const path = require('path');


function copyFile(source, target) {
    fs.copyFile(source, path.join(__dirname, path.join('../', target)), (err) => {
        if (err) return console.error(err);
        console.log('File copied.');
    });
}

function addUser(db, user) {
    let sql = 'INSERT INTO users (name, surname, sex, birthday, cf, city, role) VALUES (?, ?, ?, ?, ?, ?, ?);';
    db.prepare(sql).run([user.name, user.surname, user.sex, user.birthday, user.cf, user.city, user.role]);
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


function addEvent(db, event) {
    let sql = 'INSERT INTO events (name, description, notes, start_datetime, end_datetime, site, users) VALUES (?, ?, ?, ?, ?, ?, ?);';
    db.prepare(sql).run([event.name, event.description, event.notes, event.start_datetime, event.end_datetime, event.site, event.users]);

    return 'ok';
}

function getEvents(db) {
    return db.prepare('SELECT * FROM events;').all([]);
}



module.exports.addUser = addUser;
module.exports.getUsers = getUsers;
module.exports.delUser = delUser;
module.exports.modifyUser = modifyUser;

module.exports.addEvent = addEvent;
module.exports.getEvents = getEvents;