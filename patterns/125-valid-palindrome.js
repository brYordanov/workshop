// const isPalindrome = (str) => {
//   const cleanStr = str.replace(/[^a-z0-9]/gi, '').toLowerCase();

//   if (cleanStr.length <= 1) return true;

//   let startPointer = 0;
//   let endPointer = cleanStr.length - 1;
//   while (startPointer < endPointer) {
//     if (cleanStr[startPointer] !== cleanStr[endPointer]) {
//       return false;
//     }
//     startPointer++;
//     endPointer--;
//   }

//   return true;
// };

const isPalindrome = (s) => {
  if (s.length <= 1) return true;

  let left = 0;
  let right = s.length - 1;

  const isAlphaNum = (c) =>
    (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9');

  while (left < right) {
    while (left < right && !isAlphaNum(s[left])) left++;
    while (left < right && !isAlphaNum(s[right])) right--;

    if (s[left].toLowerCase() !== s[right].toLowerCase()) {
      console.log(false);

      return false;
    }
    left++;
    right--;
  }
  console.log(true);

  return true;
};

const data = [
  'A man, a plan, a canal: Panama',
  //   'race a car',
  //   '',
  //   'awdawdawdawdawdawdawdawd',
];

data.forEach((d) => isPalindrome(d));
