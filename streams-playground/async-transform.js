const {Transform} = require('stream')
const fs = require('fs')

const slowTransform = new Transform({
    async transform(chunk, encoding, callback) {
        await new Promise(r => setTimeout(r, 10))
        this.push(chunk)
        callback()
    }
})

fs.createReadStream('big.txt').pipe(slowTransform).pipe(fs.createWriteStream('slow.txt'))