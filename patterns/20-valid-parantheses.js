const isValid = (s) => {
  let stack = [];
  const matches = {
    ']': '[',
    '}': '{',
    ')': '(',
  };

  for (const ch of s) {
    if (matches[ch]) {
      if (stack.pop() !== matches[ch]) return false;
    } else {
      stack.push(ch);
    }
  }

  return stack.length === 0;
};

const data = [
  //   '()',
  //   '()[]{}',
  //   '(]',
  '([])',
  '([)]',
  //   'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
];

data.forEach((d) => isValid(d));
