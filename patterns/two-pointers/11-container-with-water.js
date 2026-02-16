const maxArea = (height) => {
  const calcArea = (startIndex, endIndex) => {
    const areaMaxHeight = Math.min(height[startIndex], height[endIndex]);
    const area = areaMaxHeight * (endIndex - startIndex);
    return area;
  };

  let start = 0;
  let end = height.length - 1;
  let maxArea = 0;

  while (start < end) {
    const currentArea = calcArea(start, end);
    if (currentArea > maxArea) maxArea = currentArea;

    if (height[start] < height[end]) start++;
    else end--;
  }

  console.log(maxArea);

  return maxArea;
};

const data = [
  [1, 8, 6, 2, 5, 4, 8, 3, 7],
  //   [1, 1],
];

data.forEach((d) => maxArea(d));
