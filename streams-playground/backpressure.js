const fs = require('fs')

const read = fs.createReadStream('big.txt')
const write = fs.createWriteStream('out.txt')

read.on('data', chunk => {
    const ok = write.write(chunk)
    console.log('write ok?', ok);

    if(ok) return
    
    console.log('pause read');
    read.pause()

    write.once('drain', () => {
        console.log('resume read');
        read.resume()        
    })    
})