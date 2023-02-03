const pug = require('pug');
const fs = require('fs');
const path = require('path');


const compiledFunction = pug.compileFile(path.join(__dirname, 'bin/views/home.pug'));


fs.writeFile(path.join(__dirname, 'bin/home.html'), compiledFunction({title: 'Home'}), (err) => {
    if (err) throw err;

    console.log('Done!');
});