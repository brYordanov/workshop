import { buildLinkedList } from '../helpers.js';

const reverseList = (arr) => {
  const head = buildLinkedList(arr);
  console.log(head);

  let curr = head;
  let prev = null;
  while (curr) {
    const tempNext = curr.next;
    curr.next = prev;
    prev = curr;
    curr = tempNext;
  }

  console.log(prev);
  return prev;
};

const data = [
  [1, 2, 3, 4, 5],
  //   [1, 2],
  //   [],
  //   ['aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'],
];

data.forEach((d) => reverseList(d));
