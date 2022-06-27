const quickTk = function (length) {
    let add = 1
    let max = 12 - add
    if (length > max) 
        return generate(max) + generate(length - max)
    max = Math.pow(10, length + add)
    let min = max/10
    let number = Math.floor( Math.random() * (max - min + 1) ) + min
    return ("" + number).substring(add)
}

module.exports = {
    quickTk
}



 