// const checkInclusion = ([s1, s2]) => {
//   let start = 0;
//   let matchCount = 0;
//   while (start < s2.length) {
//     if (s1.includes(s2[start])) {
//       let end = start + 1;
//       matchCount++;
//       if (matchCount === s1.length) {
//         console.log(true);

//         return true;
//       }
//       while (start <= end && end < s2.length) {
//         if (end - start + 1 > s1.length) break;
//         if (s1.includes(s2[end])) {
//           matchCount++;
//         } else {
//           matchCount = 0;
//           break;
//         }

//         if (matchCount === s1.length) {
//           console.log(true);

//           return true;
//         }

//         end++;
//       }
//     }
//     start++;
//   }

//   console.log(false);

//   return false;
// };
// you are not checking if all chars of s1 have been matched in s2

// const checkInclusion = ([s1, s2]) => {
//   if (s1.length > s2.length) return false;

//   const freqMap = new Map();
//   for (const char of s1) {
//     freqMap.set(char, (freqMap.get(char) || 0) + 1);
//   }

//   let missingChars = s1.length;
//   let start = 0;

//   for (let end = 0; end < s2.length; end++) {
//     const endChar = s2[end];

//     if (freqMap.has(endChar)) {
//       if (freqMap.get(endChar) > 0) missingChars--;
//       freqMap.set(endChar, freqMap.get(endChar) - 1);
//     }

//     if (end - start + 1 > s1.length) {
//       const startChar = s2[start];
//       if (freqMap.has(startChar)) {
//         if (freqMap.get(startChar) >= 0) missingChars++;
//         freqMap.set(startChar, freqMap.get(startChar) + 1);
//       }
//       start++;
//     }

//     if (missingChars === 0) {
//       console.log(true);
//       return true;
//     }
//   }

//   console.log(false);
//   return false;
// };

const checkInclusion = ([s1, s2]) => {
  if (s1.length > s2.length) return false;
  const idx = (c) => c.charCodeAt(0) - 97;
  const count = Array(26).fill(0);

  for (let char of s1) {
    count[idx(char)]++;
  }

  let missing = s1.length;
  let left = 0;

  for (let right = 0; right < s2.length; right++) {
    const r = idx(s2[right]);
    if (count[r] > 0) missing--;
    count[r]--;

    if (right - left + 1 > s1.length) {
      const l = idx(s2[left]);
      if (count[l] >= 0) missing++;
      count[l]++;
      left++;
    }

    if (missing === 0) return true;
  }

  return false;
};

const data = [
  ['ab', 'eidbaooo'],
  //   ['ab', 'eidboaoo'],
  //   ['a', 'ab'],
  //   ['hello', 'ooolleoooleh'],
];

data.forEach((d) => checkInclusion(d));
