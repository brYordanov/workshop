const {Transform} = require('stream')
const fs = require('fs')

const upper = new Transform({
    transform(chunk, encoding, callback) {
        this.push(chunk.toString().toUpperCase())
        callback()
    }
})

fs.createReadStream('big.txt').pipe(upper).pipe(fs.createWriteStream('upper.txt'))