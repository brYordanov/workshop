import { buildLinkedList, ListNode } from '../helpers';

function buildLinkedListWIthCycles(arr, pos) {
  if (arr.length === 0) return null;

  const head = new ListNode(arr[0]);
  let current = head;
  let cycleNode = pos === 0 ? head : null;

  for (let i = 1; i < arr.length; i++) {
    current.next = new ListNode(arr[i]);
    current = current.next;

    if (i === pos) {
      cycleNode = current;
    }
  }

  if (pos !== -1) {
    current.next = cycleNode;
  }
}

const hasCycle = (head) => {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;

    if (slow === fast) {
      return true;
    }
  }

  return false;
};

const data = [[3, 2, 0, -4], [1, 2], [1]].map((arr) => buildLinkedList(arr));
data.forEach((d) => hasCycle(d));
// const loopedLinkedList = buildLinkedList([3, 2, 0, -4], 3);
// hasCycle(loopedLinkedList);
