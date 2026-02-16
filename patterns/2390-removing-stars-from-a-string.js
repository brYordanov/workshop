const removeStars = (s) => {
  let stack = [];

  for (let i = 0; i < s.length; i++) {
    if (s[i] === '*') {
      stack.pop();
    } else {
      stack.push(s[i]);
    }
  }

  return stack.join('');
};

const data = [
  // 'leet**cod*e',
  'erase*****',
  //   'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
];

data.forEach((d) => removeStars(d));
