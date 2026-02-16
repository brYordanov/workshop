const dailyTemperature = (temperatures) => {
  const res = Array(temperatures.length).fill(0);
  const stack = [];
  for (let i = 0; i < temperatures.length; i++) {
    while (
      stack.length > 0 &&
      temperatures[i] > temperatures[stack[stack.length - 1]]
    ) {
      const index = stack.pop();
      res[index] = i - index;
    }
    stack.push(i);
  }

  console.log(res);
};

const data = [
  // [73, 74, 75, 71, 69, 72, 76, 73],
  // [30, 40, 50, 60],
  [30, 60, 90],
];

data.forEach((d) => dailyTemperature(d));
