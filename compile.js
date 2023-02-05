const pug = require('pug');
const fs = require('fs');
const path = require('path');


const views = {
    home: {src: path.join(__dirname, 'bin/views/home.pug'), dest: path.join(__dirname, 'assets/html/home.html'), locals: {view_title: 'Eventi in programma'}},
    events : {src: path.join(__dirname, 'bin/views/events.pug'), dest: path.join(__dirname, 'assets/html/events.html'), locals: {view_title: 'Eventi'}},
    users: {src: path.join(__dirname, 'bin/views/users.pug'), dest: path.join(__dirname, 'assets/html/users.html'), locals: {view_title: 'Volontari'}},
    add_event: {src: path.join(__dirname, 'bin/views/add-event.pug'), dest: path.join(__dirname, 'assets/html/add-event.html'), locals: {view_title: 'Creazione evento'}},
    add_user: {src: path.join(__dirname, 'bin/views/add-user.pug'), dest: path.join(__dirname, 'assets/html/add-user.html'), locals: {view_title: 'Creazione volontario'}},
    info_event: {src: path.join(__dirname, 'bin/views/info-event.pug'), dest: path.join(__dirname, 'assets/html/info-event.html'), locals: {view_title: 'Informazioni evento'}},
    info_user: {src: path.join(__dirname, 'bin/views/info-user.pug'), dest: path.join(__dirname, 'assets/html/info-user.html'), locals: {view_title: 'Informazioni volontario'}},
    modify_event: {src: path.join(__dirname, 'bin/views/modify-event.pug'), dest: path.join(__dirname, 'assets/html/modify-event.html'), locals: {view_title: 'Modifica evento'}},
    modify_user: {src: path.join(__dirname, 'bin/views/modify-user.pug'), dest: path.join(__dirname, 'assets/html/modify-user.html'), locals: {view_title: 'Modifica volontario'}}
};


for (let v in views) {
    let compiledFunction = pug.compileFile(views[v].src);
    fs.writeFileSync(views[v].dest, compiledFunction(views[v].locals));
    console.log(`${v} done!`);
}