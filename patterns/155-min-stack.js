// class Main {
//   MinStack = () => {
//     this.stack = [];
//     console.log('minStack');
//   };

//   push = (val) => {
//     const min = this.stack.length === 0 ? val : Math.min(val, this.getMin());
//     this.stack.push([val, min]);
//     console.log('push');
//   };

//   pop = () => {
//     this.stack.pop();
//     console.log('pop');
//   };

//   top = () => {
//     console.log('top');
//     return this.stack[this.stack.length - 1][0];
//   };

//   getMin = () => {
//     console.log('get min');
//     return this.stack[this.stack.length - 1][1];
//   };
// }

class Main {
  MinStack = () => {
    this.stack = [];
    this.minStack = [];
    console.log('minStack');
  };

  push = (val) => {
    console.log('push');
    this.stack.push(val);
    if (
      this.minStack.length === 0 ||
      val <= this.minStack[this.minStack.length - 1]
    ) {
      this.minStack.push(val);
    }
  };

  pop = () => {
    console.log('pop');
    const val = this.stack.pop();
    if (val === this.minStack[this.minStack.length - 1]) {
      this.minStack.pop();
    }
  };

  top = () => {
    console.log('top');
    return this.stack[this.stack.length - 1];
  };

  getMin = () => {
    console.log('get min');
    return this.minStack[this.minStack.length - 1];
  };
}

const call = ([commands, values]) => {
  const initializedClass = new Main();
  for (let i = 0; i < commands.length; i++) {
    initializedClass[commands[i]](values[i]);
  }
};

const data = [
  [
    ['MinStack', 'push', 'push', 'push', 'getMin', 'pop', 'top', 'getMin'],
    [[], [-2], [0], [-3], [], [], [], []],
  ],
];

data.forEach((d) => call(d));
