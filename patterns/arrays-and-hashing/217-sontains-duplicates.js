const containsDuplicates = (nums) => {
  const numSet = new Set(nums);
  const res = numSet.size !== nums.length;
  console.log(res);

  return res;
};

const data = [
  [1, 2, 3, 1],
  [1, 2, 3, 4],
  [1, 1, 1, 3, 3, 4, 3, 2, 4, 2],
];

data.forEach((d) => containsDuplicates(d));
