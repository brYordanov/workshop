const finalPrices = (prices) => {
  let stack = [];
  let res = [...prices];

  for (let i = 0; i < prices.length; i++) {
    console.log(`Run Num: ${i}`);
    console.log(`Stack: ${stack}`);
    console.log(`Curr: ${prices[i]}`);

    while (stack.length > 0 && prices[i] <= prices[stack[stack.length - 1]]) {
      console.log('entered while');

      const index = stack.pop();
      res[index] = prices[index] - prices[i];
    }
    stack.push(i);
    console.log(`Res: ${res}`);
    console.log('---------');
  }

  console.log(res);
  console.log(stack);

  return res;
};

const data = [
  [8, 4, 6, 2, 3],
  //   [1, 2, 3, 4, 5],
  //   [10, 1, 1, 6],
];

data.forEach((d) => finalPrices(d));
