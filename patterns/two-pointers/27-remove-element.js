// const removeElement = ({ nums, val }) => {
//   let slow = 0;

//   for (let fast = 0; fast < nums.length; fast++) {
//     if (nums[fast] !== val) {
//       nums[slow] = nums[fast];
//       slow++;
//     }
//   }

//   //   return slow + 1;
//   console.log(`Final nums: ${nums}`);
//   console.log(`Final index: ${slow}`);
// };

const removeElement = ({ nums, val }) => {
  let i = 0;
  let k = nums.length - 1;

  while (i < k + 1) {
    console.log(`i: ${i}, value: ${nums[i]}`);
    console.log(`k: ${k}, value: ${nums[k]}`);
    console.log(`nums: ${nums}`);

    if (nums[i] === val) {
      console.log('entered if');

      nums[i] = nums[k];
      k--;
    } else {
      i++;
    }
  }

  console.log(`final index: ${k + 1}`);

  return k + 1;
};

const data = [
  // { nums: [3, 2, 2, 3], val: 3 },
  { nums: [0, 1, 2, 2, 3, 0, 4, 2], val: 2 },
  // { nums: [3, 3], val: 3 },
];

data.forEach((d) => removeElement(d));
