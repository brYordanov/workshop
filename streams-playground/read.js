const fs = require('fs')

const stream = fs.createReadStream('big.txt', {
    encoding: 'utf8',
    highWaterMark: 64 * 1024
})

stream.on('data', chunk => {
    console.log('chunk size: ', chunk);    
})

stream.on('end', () => {
    console.log('done');    
})