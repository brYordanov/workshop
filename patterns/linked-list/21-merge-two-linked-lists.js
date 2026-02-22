import { buildLinkedList } from '../helpers.js';

const mergeTwoLists = ([some1, some2]) => {
  let list1 = buildLinkedList(some1);
  let list2 = buildLinkedList(some2);

  const dummy = { val: 0, next: null };
  let result = dummy;

  while (list1 && list2) {
    if (list1.val <= list2.val) {
      result.next = list1;
      list1 = list1.next;
    } else {
      result.next = list2;
      list2 = list2.next;
    }

    result = result.next;
  }

  result.next = list1 || list2;

  return dummy.next;
};

const data = [
  [
    [1, 2, 4],
    [1, 3, 4],
  ],
  //   [[], []],
  //   [[], [0]],
];

data.forEach((d) => mergeTwoLists(d));
