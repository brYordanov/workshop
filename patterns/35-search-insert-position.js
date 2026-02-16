const searchInsert = ([nums, target]) => {
  let anchor = 0;
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    anchor = Math.floor((left + right) / 2);

    if (nums[anchor] === target) {
      return anchor;
    } else if (nums[anchor] < target) {
      left = anchor + 1;
    } else {
      right = anchor - 1;
    }
  }

  return left;
};

const data = [
  [[1, 3, 5, 6], 5],
  [[1, 3, 5, 6], 2],
  [[1, 3, 5, 6], 7],
  [[1, 3, 5, 6], 0],
  [[1, 3, 5, 6], 4],
];

data.forEach((d) => searchInsert(d));
