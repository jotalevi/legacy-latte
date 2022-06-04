const utils = require('../src/utils/')

async function main() {

    let filename = 'onepiece.jpg'
    let uri = 'https://gogocdn.net/images/anime/One-piece.jpg'

    await utils.rzimg.donwload(uri, filename)
    await utils.rzimg.rezise(filename)

}

main()