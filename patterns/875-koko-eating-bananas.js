const minEatingSPeed = ([piles, h]) => {
  const canFinish = (k) => {
    let hours = 0;
    for (const pile of piles) {
      hours += Math.ceil(pile / k);
    }

    return hours <= h;
  };

  let left = 1;
  let right = Math.max(...piles);

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (canFinish(mid)) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  return left;
};

const data = [
  [[3, 6, 7, 11], 8],
  [[30, 11, 23, 4, 20], 5],
  [[30, 11, 23, 4, 20], 6],
];

data.forEach((d) => minEatingSPeed(d));
