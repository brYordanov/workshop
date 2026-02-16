// const maxProfit = (prices) => {
//   let buyIndex = 0;
//   let sell = 0;
//   let maxProfit = 0;
//   for (let right = 0; right < prices.length; right++) {
//     if (
//       prices[right] > sell &&
//       right > buyIndex &&
//       prices[right] > prices[buyIndex]
//     ) {
//       sell = prices[right];
//     }
//     if (prices[right] < prices[buyIndex] && right < prices.length - 1) {
//       buyIndex = right;
//       sell = 0;
//     }

//     if (sell === 0) continue;
//     maxProfit = Math.max(maxProfit, sell - prices[buyIndex]);
//   }

//   if (sell === 0 && maxProfit === 0) {
//     return 0;
//   }

//   return maxProfit;
// };
// SHAME

const maxProfit = (prices) => {
  let minPrice = Number.MAX_SAFE_INTEGER;
  let maxProfit = 0;

  for (const price of prices) {
    if (price < minPrice) {
      minPrice = price;
    } else {
      maxProfit = Math.max(maxProfit, price - minPrice);
    }
  }

  return maxProfit;
};

const data = [
  [7, 1, 5, 3, 6, 4],
  [7, 6, 4, 3, 1],
  [1, 2],
  [3, 2, 6, 5, 0, 3],
];

data.forEach((d) => maxProfit(d));
