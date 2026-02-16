// const characterReplacement = ([s, k]) => {
//   let maxSeqCount = 0;

//   for (let slow = 0; slow < s.length; slow++) {
//     if (s.length - 1 - slow < maxSeqCount - k) break;
//     let fast = slow + 1;
//     let currSeqCound = 1;
//     let currBreakCount = k;

//     while (slow < s.length - 1 && fast < s.length) {
//       if (s[slow] === s[fast]) {
//         currSeqCound++;
//       } else {
//         if (currBreakCount > 0) {
//           currSeqCound++;
//           currBreakCount--;
//         } else {
//           break;
//         }
//       }
//       fast++;
//     }

//     currSeqCound += Math.min(currBreakCount, slow);
//     maxSeqCount = Math.max(maxSeqCount, currSeqCound);
//   }

//   console.log(maxSeqCount);

//   return maxSeqCount;
// };
// not it wtf O(n*n)

const characterReplacement = function ([s, k]) {
  let left = 0;
  let maxFreq = 0;
  let freq = {};
  let res = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    freq[char] = (freq[char] || 0) + 1;

    maxFreq = Math.max(maxFreq, freq[char]);

    while (right - left + 1 - maxFreq > k) {
      freq[s[left]]--;
      left++;
    }

    res = Math.max(res, right - left + 1);
  }

  return res;
};

const data = [
  // ['ABAB', 2],
  ['AABABBA', 1],
];

data.forEach((d) => characterReplacement(d));
