const findMaxAverage = function ([nums, k]) {
  let start = 0;
  let sum = 0;
  let maxAverage = -Number.MAX_VALUE;

  for (let end = 0; end < nums.length; end++) {
    while (end - start + 1 > k) {
      sum -= nums[start];
      start++;
    }

    sum += nums[end];
    if (end - start + 1 === k) {
      const currentAverage = sum / k;
      maxAverage = Math.max(maxAverage, currentAverage);
    }
  }

  return maxAverage;
};

const data = [
  [[1, 12, -5, -6, 50, 3], 4],
  [[5], 1],
];

data.forEach((d) => findMaxAverage(d));
