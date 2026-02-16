const threeSum = (nums) => {
  nums.sort((a, b) => a - b);
  const results = [];

  for (let anchor = 0; anchor < nums.length - 2; anchor++) {
    if (anchor > 0 && nums[anchor] === nums[anchor - 1]) continue;

    if (nums[anchor] > 0) break;

    let left = anchor + 1;
    let right = nums.length - 1;

    while (left < right) {
      const leftVal = nums[left];
      const rightVal = nums[right];
      const sum = nums[anchor] + leftVal + rightVal;

      if (sum === 0) {
        results.push([nums[anchor], leftVal, rightVal]);
        left++;
        right--;
        while (left < right && nums[left] === leftVal) left++;
        while (left < right && nums[right] === rightVal) right--;
      } else if (sum < 0) {
        left++;
        while (left < right && nums[left] === leftVal) left++;
      } else {
        right--;
        while (left < right && nums[right] === rightVal) right--;
      }
    }
  }

  console.log(results);

  return results;
};

const data = [
  //   [-1, 0, 1, 2, -1, -4],
  //   [-100, -70, -60, 110, 120, 130, 160],
  [-4, -2, -2, -2, 0, 1, 2, 2, 2, 3, 3, 4, 4, 6, 6],
  //   [0, 1, 1],
  //   [0, 0, 0],
];

data.forEach((d) => threeSum(d));
