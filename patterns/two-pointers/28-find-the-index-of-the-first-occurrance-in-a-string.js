const findOccurance = ({ needle, haystack }) => {
  if (needle.length > haystack.length) return -1;

  for (let i = 0; i <= haystack.length - needle.length; i++) {
    let j = 0;
    console.log(`i is at: ${i}`);
    console.log(`j is at: ${j}`);
    console.log(`haystack[i + j]: ${haystack[i + j]}`);
    console.log(`needle[j]: ${needle[j]}`);

    while (j < needle.length && haystack[i + j] === needle[j]) {
      console.log('letters matched');

      j++;
    }

    if (needle.length === j) {
      console.log(`FOUND AT: ${i} index`);

      return i;
    }
  }

  console.log('NOT FOUND');
  return -1;
};

const data = [
  // { needle: 'sad', haystack: 'sadbutsad' },
  // { needle: 'leeto', haystack: 'leetcode' },
  { needle: 'car', haystack: 'awdpojocaplcara' },
];

data.forEach((d) => findOccurance(d));
