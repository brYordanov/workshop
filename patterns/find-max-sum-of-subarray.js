const arr = [2, 1, 5, 1, 3, 2];
const k = 3;

let left = 0;
let sum = 0;
let max = 0;

for (let right = 0; right < arr.length; right++) {
  sum += arr[right];

  if (right - left + 1 > k) {
    sum -= arr[left];
    left++;
  }

  if (right - left + 1 === k) {
    max = Math.max(max, sum);
  }
}

console.log(max);
