const twoSum = ([nums, target]) => {
  const numMap = new Map();

  for (let i = 0; i < nums.length; i++) {
    const needed = target - nums[i];

    if (numMap.has(needed)) {
      console.log([i, numMap.get(needed)]);

      return [i, numMap.get(needed)];
    }

    numMap.set(nums[i], i);
  }
};

const data = [
  [[2, 7, 11, 15], 9],
  [[3, 2, 4], 6],
  [[3, 3], 6],
];
data.forEach((d) => twoSum(d));
