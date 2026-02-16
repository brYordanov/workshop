// const lengthOfLongestSubstring = (s) => {
//   if (s.length === 1) return 1;
//   let maxLength = 0;

//   for (let anchor = 0; anchor < s.length - 1; anchor++) {
//     let wEnd = anchor + 1;
//     const uniqueValues = [s[anchor]];
//     console.log(`anchor: ${s[anchor]} -------- index: ${anchor}`);

//     while (wEnd <= s.length - 1) {
//       console.log(`inner: ${s[wEnd]} -------- index: ${wEnd}`);

//       if (uniqueValues.includes(s[wEnd])) {
//         wEnd++;
//         break;
//       }

//       uniqueValues.push(s[wEnd]);
//       wEnd++;
//     }

//     console.log(uniqueValues);

//     maxLength =
//       uniqueValues.length > maxLength ? uniqueValues.length : maxLength;
//     console.log(maxLength);
//   }

//   console.log('final: ' + maxLength);

//   return maxLength;
// };

// const lengthOfLongestSubstring = (s) => {
//   let left = 0;
//   let maxLength = 0;
//   const seen = new Set();

//   for (let right = 0; right < s.length; right++) {
//     while (seen.has(s[right])) {
//       seen.delete(s[left]);
//       left++;
//     }

//     seen.add(s[right]);
//     maxLength = Math.max(maxLength, right - left + 1);
//   }

//   return maxLength;
// };

const lengthOfLongestSubstring = (s) => {
  let left = 0;
  let maxLength = 0;
  const lastSeen = new Map();

  for (let right = 0; right < s.length; right++) {
    if (lastSeen.has(s[right])) {
      left = Math.max(left, lastSeen.get(s[right]) + 1);
    }

    lastSeen.set(s[right], right);
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
};

const data = [
  //   'abcabcbb',
  //   'bbbbb',
  //   'pwwkew',
  //   'awdawdawdawdawdawdawdawdawdawdawdawdawd',
  //   'au',
  //   '',
  // 'aab',
  'dvdf',
];
data.forEach((d) => lengthOfLongestSubstring(d));
