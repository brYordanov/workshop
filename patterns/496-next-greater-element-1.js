const nextGreaterElement = ([nums1, nums2]) => {
  const theMap = new Map();
  const stack = [];

  for (const num of nums2) {
    while (stack.length > 0 && num > stack[stack.length - 1]) {
      const poppedNum = stack.pop();
      theMap.set(poppedNum, num);
    }
    stack.push(num);
  }

  console.log(theMap);
  const res = [];
  for (const num of nums1) {
    if (theMap.has(num)) {
      res.push(theMap.get(num));
    } else {
      res.push(-1);
    }
  }

  console.log(res);
};

const data = [
  // [
  //   [4, 1, 2],
  //   [1, 3, 4, 2],
  // ],
  [
    [2, 4],
    [1, 2, 3, 4],
  ],
];

data.forEach((d) => nextGreaterElement(d));
