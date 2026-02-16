const fs = require('fs')

const COUNT = 100_000
const out = fs.createWriteStream('big.json')

out.write('[\n')

for(let i = 0; i < COUNT; i++) {
    const obj = {
        id: 1,
        name: `user-${i}`,
        email: `user${i}@abv.bg`,
         active: i % 2 === 0,
         score: Math.random(),
         tags: ['a', 'b', 'c', 'd'],
         meta: {
            createdAt: Date.now(),
            index: i,
        },
    }

    out.write(JSON.stringify(obj))
    if (i < COUNT - 1) out.write(',\n')
}

out.write('\n]')
out.end()
console.log('big.json generated')