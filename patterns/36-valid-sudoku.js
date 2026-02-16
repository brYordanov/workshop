const isValidSudoku = (board) => {
  let colsMaps = new Map();
  let boxMap = new Map();

  for (let row = 0; row < board.length; row++) {
    let rowValsMap = new Map();

    for (let col = 0; col < board.length; col++) {
      if (board[row][col] === '.') continue;

      if (rowValsMap.has(board[row][col])) {
        return false;
      }

      if (!colsMaps.has(col)) {
        colsMaps.set(col, new Map());
      }
      const currentColMap = colsMaps.get(col);

      if (currentColMap.has(board[row][col])) {
        return false;
      }

      const currentBox = Math.floor(row / 3) * 3 + Math.floor(col / 3);
      if (!boxMap.has(currentBox)) {
        boxMap.set(currentBox, new Map());
      }
      const currentBoxMap = boxMap.get(currentBox);
      if (currentBoxMap.has(board[row][col])) {
        return false;
      }

      currentColMap.set(board[row][col], 0);
      currentBoxMap.set(board[row][col], 0);
      rowValsMap.set(board[row][col], 0);
    }
  }

  return true;
};

const data = [
  [
    ['5', '3', '.', '.', '7', '.', '.', '.', '.'],
    ['6', '.', '.', '1', '9', '5', '.', '.', '.'],
    ['.', '9', '8', '.', '.', '.', '.', '6', '.'],
    ['8', '.', '.', '.', '6', '.', '.', '.', '3'],
    ['4', '.', '.', '8', '.', '3', '.', '.', '1'],
    ['7', '.', '.', '.', '2', '.', '.', '.', '6'],
    ['.', '6', '.', '.', '.', '.', '2', '8', '.'],
    ['.', '.', '.', '4', '1', '9', '.', '.', '5'],
    ['.', '.', '.', '.', '8', '.', '.', '7', '9'],
  ],
  [
    ['8', '3', '.', '.', '7', '.', '.', '.', '.'],
    ['6', '.', '.', '1', '9', '5', '.', '.', '.'],
    ['.', '9', '8', '.', '.', '.', '.', '6', '.'],
    ['8', '.', '.', '.', '6', '.', '.', '.', '3'],
    ['4', '.', '.', '8', '.', '3', '.', '.', '1'],
    ['7', '.', '.', '.', '2', '.', '.', '.', '6'],
    ['.', '6', '.', '.', '.', '.', '2', '8', '.'],
    ['.', '.', '.', '4', '1', '9', '.', '.', '5'],
    ['.', '.', '.', '.', '8', '.', '.', '7', '9'],
  ],
];

data.forEach((d) => isValidSudoku(d));
