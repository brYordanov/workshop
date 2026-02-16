const {pipeline} = require('stream/promises')
const fs = require('fs')

async function run() {
    await pipeline(
        fs.createReadStream('big.txt'),
        fs.createWriteStream('safe.txt')
    )

    console.log('done safely');
    
}

run().catch(console.error)