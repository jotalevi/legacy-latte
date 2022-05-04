const fs = require('fs');

const reqlog = function (req){
    let data = JSON.parse(fs.readFileSync('public/data/reqlog.json'))
    let fIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress

    data.requests++
    data.items.push({
        ip: fIp,
        request: req.originalUrl,
        time: new Date().toISOString(),
    })

    if (!fIp in data.ips){
        data.ips.push(fIp)
        data.uniques++
    }

    fs.writeFileSync('public/data/reqlog.json', JSON.stringify(data))
    console.log(req.headers['x-forwarded-for'])
    console.log(req.connection.remoteAddress)
}

module.exports = {
    reqlog
}