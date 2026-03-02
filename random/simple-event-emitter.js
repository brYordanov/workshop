class Emitter {
  constructor() {
    this.events = new Map();
  }

  on(event, listener) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }

    this.events.get(event).add(listener);

    return () => this.off(event, listener);
  }

  off(event, listener) {
    const listeners = this.events.get(event);
    if (!listeners) throw new Error('no listeners for event');

    listeners.delete(listener);

    if (listeners.size === 0) {
      this.events.delete(event);
    }
  }

  emit(event, ...args) {
    const listeners = this.events.get(event);
    if (!listeners) throw new Error('no listeners for event');

    for (const listener of [...listeners]) {
      listener(...args);
    }
  }
}

const emitter = new Emitter();

function subscriber1(msg) {
  console.log(`hi. i am subscriber 1 and i received this message: ${msg}`);
}

function jimmy(msg) {
  console.log(`hi. i am jimmy and i received this message: ${msg}`);
}

emitter.on('message', subscriber1);

emitter.emit('message', 'secret message');

emitter.on('message', jimmy);

emitter.emit('message', 'hey there jimmy');

emitter.off('message', jimmy);

emitter.emit('message', 'jimmy left');
