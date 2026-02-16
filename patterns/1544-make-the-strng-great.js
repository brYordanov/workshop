const makeGood = (s) => {
  const stack = [];

  for (const char of s) {
    const prev = stack[stack.length - 1];

    if (prev && Math.abs(prev.charCodeAt(0) - char.charCodeAt(0)) === 32) {
      stack.pop();
    } else {
      stack.push(char);
    }
  }

  return stack.join('');
};

const data = [
  'leEeetcode',
  'Pp',
  'abBAcC',
  's',
  'kkdsFuqUfSDKK',
  //   'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
];

data.forEach((d) => makeGood(d));
