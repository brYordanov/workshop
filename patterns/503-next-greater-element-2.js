const nextGreaterElement = (nums) => {
  const n = nums.length;
  const res = new Array(n).fill(-1);

  const stack = [];

  for (let i = 0; i < 2 * n; i++) {
    const current = nums[i % n];

    while (stack.length > 0 && current > nums[stack[stack.length - 1]]) {
      const index = stack.pop();
      res[index] = current;
    }
    if (i < n) {
      stack.push(i);
    }
  }

  return res;
};

const data = [
  [1, 2, 1],
  //   [1, 2, 3, 4, 3],
];

data.forEach((d) => nextGreaterElement(d));
