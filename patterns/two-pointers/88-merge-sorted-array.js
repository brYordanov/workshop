// const mergeArrs = ([nums1, m, nums2, n]) => {
//   let firstPointer = nums1.length - n - 1;
//   let secondPointer = n - 1;

//   for (let i = nums1.length - 1; i >= 0; i--) {
//     if (
//       nums1[firstPointer] >= nums2[secondPointer] ||
//       nums2[secondPointer] === undefined
//     ) {
//       nums1[i] = nums1[firstPointer];
//       firstPointer--;
//     } else {
//       nums1[i] = nums2[secondPointer];
//       secondPointer--;
//     }
//   }
//   console.log(nums1);

//   return nums1;
// };

const mergeArrs = ([nums1, m, nums2, n]) => {
  let i = m - 1;
  let j = n - 1;
  let k = m + n - 1;

  while (j >= 0) {
    if (i >= 0 && nums1[i] > nums2[j]) {
      nums1[k] = nums1[i];
      i--;
    } else {
      nums1[k] = nums2[j];
      j--;
    }

    k--;
  }

  console.log(nums1);
  return nums1;
};

const data = [
  [[1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3],
  [[1], 1, [], 0],
  [[0], 0, [1], 1],
];

data.forEach((d) => mergeArrs(d));
