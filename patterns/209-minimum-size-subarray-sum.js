// const minSubArrayLen = ([target, nums]) => {
//   let slow = 0;
//   let fast = 0;
//   let sum = nums[slow];
//   let minLength = Number.MAX_VALUE;
//   let indicator = false;

//   while (fast < nums.length) {
//     if (sum >= target) {
//       indicator = true;
//       minLength = Math.min(minLength, fast - slow + 1);
//       sum -= nums[slow];
//       slow++;
//     } else {
//       fast++;
//       sum += nums[fast];
//     }
//   }

//   if (!indicator) {
//     console.log(0);

//     return 0;
//   }
//   console.log(minLength);
//   return minLength;
// };

const minSubArrayLen = ([target, nums]) => {
  let slow = 0;
  let sum = 0;
  let minLength = Number.MAX_VALUE;

  for (let fast = 0; fast < nums.length; fast++) {
    sum += nums[fast];

    while (sum >= target) {
      minLength = Math.min(minLength, fast - slow + 1);
      sum -= nums[slow];
      slow++;
    }
  }

  return minLength === Number.MAX_VALUE ? 0 : minLength;
};

const data = [
  //   [7, [2, 3, 1, 2, 4, 3]],
  //   [4, [1, 4, 4]],
  //   [11, [1, 1, 1, 1, 1, 1, 1, 1]],
  [6, [10, 2, 3]],
];

data.forEach((d) => minSubArrayLen(d));
