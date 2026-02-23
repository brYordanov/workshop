import { buildTree } from '../helpers.js';

const isSameTree = (p, q) => {
  if (!p && !q) return true;
  if (!p || !q) return false;
  if (p.val !== q.val) return false;

  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
};

const main = ([arr1, arr2]) => {
  const p = buildTree(arr1);
  const q = buildTree(arr2);
  const res = isSameTree(p, q);
  console.log(res);
};

const data = [
  //   [
  //     [1, 2, 3],
  //     [1, 2, 3],
  //   ],
  //   [
  //     [1, 2],
  //     [1, null, 2],
  //   ],
  [
    [1, 2, 1],
    [1, 1, 2],
  ],
];

data.forEach((d) => main(d));
