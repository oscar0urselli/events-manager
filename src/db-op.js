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

module.exports.addUser = addUser;
module.exports.getUsers = getUsers;