import { buildTree } from '../helpers.js';

const inverTree = (root) => {
  if (!root) return null;
  [root.left, root.right] = [root.right, root.left];
  inverTree(root.left);
  inverTree(root.right);

  return root;
};

const main = (data) => {
  const root = buildTree(data);
  console.log(root);
  const res = inverTree(root);
  console.log(res);
};

const data = [
  [4, 2, 7, 1, 3, 6, 9],
  //   [2, 1, 3],
  //   [],
  //   ['aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'],
];

data.forEach((d) => main(d));
