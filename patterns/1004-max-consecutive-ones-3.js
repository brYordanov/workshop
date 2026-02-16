const longestOnes = ([nums, k]) => {
  let left = 0;
  let occurances = { 0: 0, 1: 0 };
  let res = 0;

  for (let right = 0; right < nums.length; right++) {
    occurances[nums[right]]++;

    while (occurances[0] > k) {
      occurances[nums[left]]--;
      left++;
    }

    res = Math.max(res, right - left + 1);
  }

  return res;
};

const data = [
  [[1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], 2],
  //   [[0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1], 3],
];

data.forEach((d) => longestOnes(d));
