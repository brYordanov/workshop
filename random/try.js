class EventEmitter {
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
    if (!listeners) return;

    listeners.delete(listener);

    if (listeners.size === 0) {
      this.events.delete(event);
    }
  }

  emit(event, ...args) {
    const listeners = this.events.get(event);
    if (!listeners) return;

    for (const listener of [...listeners]) {
      try {
        listener(...args);
      } catch (err) {
        if (event !== 'error' && this.events.has('error')) {
          this.emit('error', err);
        } else {
          throw err;
        }
      }
    }
  }

  once(event, listener) {
    const wrapper = (...args) => {
      this.off(event, listener);
      listener(...args);
    };

    return this.on(event, wrapper);
  }

  async asyncEmit(event, ...args) {
    const listeners = this.events.get(event);
    if (!listeners) return;

    await Promise.all(
      [...listeners].map((listener) => Promise.resolve(listener(...args)))
    );
  }

  once() {}
}
