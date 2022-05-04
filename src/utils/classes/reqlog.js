const fs = require('fs');

const reqlog = function (req){
    let data = JSON.parse(fs.readFileSync('public/data/reqlog.json'))
    
    data.requests++
    data.items.push({
        ip: req.socket.remoteAddress,
        request: req.originalUrl,
        time: new Date().toISOString(),
    })

    if (!req.socket.remoteAddress in data.ips){
        data.ips.push(req.socket.remoteAddress)
        data.uniques++
    }

    fs.writeFileSync('public/data/reqlog.json', JSON.stringify(data))
    console.log(data)
}

module.exports = {
    reqlog
}