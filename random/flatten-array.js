function flattenRecursive(arr, depth = Infinity) {
  const result = [];

  arr.forEach((item) => {
    if (Array.isArray(item) && depth > 0) {
      result.push(...flattenRecursive(item, depth - 1));
    } else {
      result.push(item);
    }
  });

  return result;
}

function flattenIterative(arr) {
  const stack = [...arr];
  const result = [];

  while (stack.length) {
    const next = stack.pop();

    if (Array.isArray(next)) {
      stack.push(...next);
    } else {
      result.push(next);
    }
  }

  return result.reverse();
}

function flattenIterativeWithDepth(arr, maxDepth = Infinity) {
  const stack = arr.map((item) => [item, 0]);
  const result = [];

  while (stack.length) {
    const [next, depth] = stack.pop();

    if (Array.isArray(next) && depth < maxDepth) {
      stack.push(...next.map((item) => [item, depth + 1]));
    } else {
      result.push(next);
    }
  }

  return result.reverse();
}

const testArr = [1, [2, [3]]];
const some = iterativeWithDepth(testArr, 1);
console.log(some);
