const removeDuplicates = (numArr) => {
  let slow = 0;

  for (let fast = 0; fast < numArr.length; fast++) {
    console.log('NEW CYCLE');

    console.log(`fast: ${fast}`);
    console.log(`slow: ${slow}`);
    console.log(`arr: ${numArr}`);
    console.log(`entered if: ${numArr[fast] !== numArr[slow]}`);

    if (numArr[fast] !== numArr[slow]) {
      slow++;
      console.log(`slow is now: ${slow}`);
      console.log(`${numArr[fast]} will be assigned to ${numArr[slow]}`);

      numArr[slow] = numArr[fast];
    }
  }
  console.log(`final numArr: ${numArr}`);
  console.log(`final lenght: ${slow}`);
  console.log(`result arr: ${numArr.slice(0, slow + 1)}`);
};

const data = [
  //   [1, 1, 2],
  [0, 0, 1, 1, 1, 2, 2, 3, 3, 4],
];

data.forEach((d) => removeDuplicates(d));
