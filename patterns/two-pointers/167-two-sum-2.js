const twoSum = ([numbers, target]) => {
  console.log(numbers, target);
  let start = 0;
  let end = numbers.length - 1;

  while (start < end) {
    const sum = numbers[start] + numbers[end];
    if (sum > target) {
      end--;
    } else if (sum < target) {
      start++;
    } else {
      console.log([start + 1, end + 1]);
      return [start + 1, end + 1];
    }
  }
};

const data = [
  [[2, 7, 11, 15], 9],
  //   [[2, 3, 4], 6],
  //   [[-1, 0], -1],
];

data.forEach((d) => twoSum(d));
