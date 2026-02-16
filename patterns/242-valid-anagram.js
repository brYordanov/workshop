const isAnagram = ([s, t]) => {
  if (s.length !== t.length) return false;

  let freqMap = new Map();
  for (let char of s) {
    freqMap.set(char, (freqMap.get(char) | 0) + 1);
  }

  for (let char of t) {
    if (freqMap.has(char) && freqMap.get(char) >= 1) {
      freqMap.set(char, freqMap.get(char) - 1);
    } else return false;
  }

  return true;
};

const data = [
  // ['anagram', 'nagaram'],
  // ['rat', 'car'],
  // ['a', 'ab'],
  ['aacc', 'ccac'],
];

data.forEach((d) => isAnagram(d));
