const searchRange = ([nums, target]) => {
  let lowerBound = 0;
  let higherBound = 0;

  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (nums[mid] >= target) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }
  lowerBound = left;

  left = 0;
  right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] <= target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  higherBound = right;

  if (lowerBound <= higherBound) {
    return [lowerBound, higherBound];
  }

  return [-1, -1];
};

const data = [
  //   [[5, 7, 7, 8, 8, 10], 8],
  [[5, 7, 7, 8, 8, 10], 6],
  //   [[], 0],
];

data.forEach((d) => searchRange(d));
