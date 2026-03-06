type Listener = (...args: unknown[]) => void;

class EventEmitter {
  private events;
  constructor() {
    this.events = new Map<string, Set<Listener>>();
  }

  on(event: string, listener: Listener) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }

    this.events.get(event)!.add(listener);

    return this.off(event, listener);
  }

  off(event: string, listener: Listener) {
    const listeners = this.events.get(event);
    if (!listeners) return;
  }

  emit() {}
}
