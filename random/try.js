const testArr = [1, [2, [3, [4]]], 5];

function flattenArray(arr, depth) {
  const result = [];
  const stack = arr.map((item) => [item, depth]);

  while (stack.length) {
    const [next, currDepth] = stack.pop();
    if (Array.isArray(next) && currDepth > 0) {
      stack.push(...next.map((item) => [item, currDepth - 1]));
    } else {
      result.push(next);
    }
  }

  return result.reverse();
}

const some = flattenArray(testArr, 2);
console.log(some);
