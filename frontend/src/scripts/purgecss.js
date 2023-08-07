const exec = require('child_process').exec;
const fs = require('fs');
const path = require('path');

// find the styles css file
const files = getFilesFromPath('./build/static/css/', '.css');
let data = [];

if (!files && files.length <= 0) {
    console.log("cannot find style files to purge");
    return;
}

for (let f of files) {
    // get original file size
    const originalSize = getFilesizeInKiloBytes('./build/static/css/' + f) + 'kb';
    var o = { file: f, originalSize: originalSize, newSize: '' };
    data.push(o);
}
console.log('Run PurgeCSS...');
exec(
    './node_modules/purgecss/bin/purgecss.js -css build/static/css/*.css --content build/index.html build/static/js/*.js -o build/static/css/',
    function (error, stdout, stderr) {
        console.log('PurgeCSS done');
        console.log(data);

        for (let d of data) {
            // get new file size
            const newSize = getFilesizeInKiloBytes('./build/static/css/' + d.file) + 'kb';
            d.newSize = newSize;
        }
        console.table(data);
    }
);

function getFilesizeInKiloBytes(filename) {
    var stats = fs.statSync(filename);
    var fileSizeInBytes = stats.size / 1024;
    return fileSizeInBytes.toFixed(2);
}

function getFilesFromPath(dir, extension) {
    let files = fs.readdirSync(dir);
    return files.filter((e) => path.extname(e).toLowerCase() === extension);
}