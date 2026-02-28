const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => resolve('1111'), 2000);
});
const promise2 = new Promise((resolve, reject) => {
  setTimeout(() => reject('2222'), 1000);
});
const promise3 = new Promise((resolve, reject) => {
  //   setTimeout(() => resolve('3333'), 0);
  reject('3333');
});

const arr = [promise1, promise2, promise3];

function promiseAll(promises) {
  return new Promise((res, rej) => {
    if (promises.length === 0) return res([]);

    const results = new Array(promises.length);
    let remaining = promises.length;

    promises.forEach((p, i) => {
      Promise.resolve(p)
        .then((value) => {
          results[i] = value;
          remaining--;
          if (remaining === 0) res(results);
        })
        .catch(rej);
    });
  });
}

// console.time('promises');
// promiseAll([promise1, promise2, promise3]).then((res) => {
//   console.log(res);
//   console.timeEnd('promises');
// });

function promiseRace(promises) {
  return new Promise((resolve, reject) => {
    promises.forEach((p) => {
      Promise.resolve(p).then(resolve).catch(reject);
    });
  });
}

// console.time('promises');
// promiseRace(arr).then((res) => {
//   console.log(res);
//   console.timeEnd('promises');
//   process.exit(1);
// });

function promiseAllSettled(promises) {
  return new Promise((resolve, reject) => {
    if (promises.length === 0) return res([]);

    const results = new Array(promises.length);
    let remainig = promises.length;

    promises.forEach((p, i) => {
      Promise.resolve(p)
        .then((res) => {
          results[i] = { status: 'fulfilled', res };
        })
        .catch((err) => {
          results[i] = { status: 'rejected', err };
        })
        .finally(() => {
          remainig--;
          if (remainig === 0) resolve(results);
        });
    });
  });
}

// console.time('promises');
// promiseAllSettled(arr).then((res) => {
//   console.log(res);
//   console.timeEnd('promises');
// });
arr.shift();
function promiseAny(promises) {
  return new Promise((resolve, reject) => {
    if (promises.length === 0)
      return reject(new AggregateError([], 'All promises were rejected'));

    const errors = new Array(promises.length);
    let remaining = promises.length;

    promises.forEach((p, i) => {
      Promise.resolve(p)
        .then(resolve)
        .catch((reason) => {
          errors[i] = reason;
          remaining--;
          if (remaining === 0)
            reject(new AggregateError(errors, 'All promises were rejected'));
        });
    });
  });
}

// console.time('promises');
// promiseAny(arr).then((res) => {
//   console.log(res);
//   console.timeEnd('promises');
// });
