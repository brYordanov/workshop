const reverseString = (s) => {
  let start = 0;
  let end = s.length - 1;

  while (start < end) {
    const buffer = s[start];

    s[start] = s[end];
    s[end] = buffer;

    start++;
    end--;
  }

  return s;
};

const data = [
  ['h', 'e', 'l', 'l', 'o'],
  ['H', 'a', 'n', 'n', 'a', 'h'],
  ['a', 'w', 'd'],
];

data.forEach((d) => reverseString(d));
