const largestRectangleArea = (heights) => {
  const stack = [];
  let maxArea = 0;

  heights.push(0);
  for (let i = 0; i <= heights.length; i++) {
    console.log(`RUN NUMBER ${i}`);

    console.log(`Start stack: ${stack}`);

    console.log(
      `Comparison heights[i](${heights[i]}) < heights[stack[stack.length - 1]](${heights[stack[stack.length - 1]]}) ===  ${heights[i] < heights[stack[stack.length - 1]]}`
    );

    while (stack.length > 0 && heights[i] < heights[stack[stack.length - 1]]) {
      console.log('ENTER WHILE');

      const topIndex = stack.pop();
      const height = heights[topIndex];
      console.log(`Top index:  ${topIndex} //// height: ${height}`);

      const rightBoundary = i;
      const leftBoundary = stack.length === 0 ? -1 : stack[stack.length - 1];
      const width = rightBoundary - leftBoundary - 1;

      console.log(`right boundry: ${rightBoundary}`);
      console.log(`left boundry: ${leftBoundary}`);

      maxArea = Math.max(maxArea, height * width);
    }

    stack.push(i);
    console.log(`End stack: ${stack}`);
    console.log('-------- NEW RUN ---------\n');
  }

  console.log(maxArea);

  return maxArea;
};

const data = [
  [2, 1, 5, 6, 2, 3],
  //   [2, 4],
];

data.forEach((d) => largestRectangleArea(d));
