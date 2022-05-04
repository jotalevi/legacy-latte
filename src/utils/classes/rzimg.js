const fs = require('fs')
const request = require('request')
var im = require('imagemagick')

const rzimg = {
    donwload: async function (uri, filename){
        await request(uri).pipe(fs.createWriteStream('public/image/' + filename))
        return filename
    },
    rezize: async function (filename){
        fs.renameSync('public/image/' + filename, 'public/image/_' + filename)
        await im.resize({
            srcPath: 'public/image/_' + filename,
            dstPath: 'public/image/' + filename,
            width: 170,
            height: 230
        })
        fs.rmSync('public/image/_' + filename)
        return filename
    },
    check: function (){
        return fs.existsSync('public/image/' + filename)
    },
    downloadAndRezise: async function (uri, filename){
        if (!fs.existsSync('public/image/' + filename)){
            await request(uri).pipe(fs.createWriteStream('public/image/_' + filename))
            await im.resize({
                srcPath: 'public/image/_' + filename,
                dstPath: 'public/image/' + filename,
                width: 170,
                height: 230
            })
            fs.rmSync('public/image/_' + filename)
        }
        return filename
    }
}

module.exports = {
    rzimg,
}