import { buildTree } from '../helpers.js';

// const maxDepth = (root) => {
//   if (!root) return 0;
//   return Math.max(maxDepth(root.left), maxDepth(root.right)) + 1;
// };

const maxDepth = (root) => {
  let max = 0;

  const dfs = (node, depth) => {
    if (!node) return;
    max = Math.max(max, depth);
    dfs(node.left, depth + 1);
    dfs(node.right, depth + 1);
  };

  dfs(root, 1);
  return max;
};

const main = (some) => {
  const root = buildTree(some);
  console.log(maxDepth(root));
};

const data = [
  [3, 9, 20, null, null, 15, 7],
  [1, null, 2],
];

data.forEach((d) => main(d));
