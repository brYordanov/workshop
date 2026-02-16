const validPalindrome = (s) => {
  const isPal = (l, r) => {
    while (l < r) {
      if (s[l] !== s[r]) return false;
      l++;
      r--;
    }

    return true;
  };

  let l = 0;
  let r = s.length - 1;

  while (l < r) {
    if (s[l] === s[r]) {
      l++;
      r--;
    } else {
      return isPal(l + 1, r) || isPal(l, r - 1);
    }
  }

  return true;
};

const data = [
  'dddbababeccebabaxbddd',
  'aguokepatgbnvfqmgmlcupuufxoohdfpgjdmysgvhmvffcnqxjjxqncffvmhvgsymdjgpfdhooxfuupuculmgmqfvnbgtapekouga',
];
data.forEach((d) => validPalindrome(d));
