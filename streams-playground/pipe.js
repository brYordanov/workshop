const fs= require('fs')

fs.createReadStream('big.txt')
.pipe(fs.createWriteStream('copy.txt'))
.on('finish', () => console.log('copied'));