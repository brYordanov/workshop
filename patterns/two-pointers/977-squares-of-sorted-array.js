const sortedSquares = function (nums) {
  let start = 0;
  let end = nums.length - 1;
  let currResIndex = nums.length - 1;
  let result = new Array(nums.length - 1);

  while (start <= end) {
    const firstNum = Math.abs(nums[start]);
    const secondNum = Math.abs(nums[end]);
    if (firstNum > secondNum) {
      result[currResIndex] = Math.pow(firstNum, 2);
      start++;
    } else {
      result[currResIndex] = Math.pow(secondNum, 2);
      end--;
    }

    currResIndex--;
  }

  console.log(result);

  return result;
};

const data = [
  //   [-4, -1, 0, 3, 10],
  [-7, -3, 2, 3, 11],
];

data.forEach((d) => sortedSquares(d));
