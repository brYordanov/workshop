function multiplication(...args) {
  return args.reduce((acc, curr) => acc * curr, 1);
}

function curry(fn, arity = fn.length) {
  return function curried(...args) {
    if (args.length >= arity) {
      return fn(...args.slice(0, arity));
    }

    return function (...nextArgs) {
      return curried(...args, ...nextArgs);
    };
  };
}

const curriedMultiplication = curry(multiplication, 4);
const some = curriedMultiplication(1)(2)(3)(5);
console.log(some);
