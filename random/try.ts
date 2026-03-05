type Listener = (...args: any[]) => void;
type EventMapWithError = Record<string, any[]> & {
  error: [Error];
};

class EventEmitter<Events extends EventMapWithError> {
  private events;
  constructor() {
    this.events = new Map<keyof Events, Set<Listener>>();
  }

  invokeListener<K extends keyof Events>(
    event: K,
    listener: (...args: Events[K]) => void,
    args: Events[K]
  ) {
    try {
      listener(...args);
    } catch (err) {
      if (event !== 'error' && this.events.has('error')) {
        const error = err instanceof Error ? err : new Error(String(err));

        this.emit('error', error);
      } else {
        throw err;
      }
    }
  }

  on<K extends keyof Events>(event: K, listener: (...args: Events[K]) => void) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }

    this.events.get(event)!.add(listener);

    return this.off(event, listener);
  }

  off<K extends keyof Events>(
    event: K,
    listener: (...args: Events[K]) => void
  ) {
    const listeners = this.events.get(event);
    if (!listeners) return;

    listeners.delete(listener);

    if (listeners.size === 0) {
      this.events.delete(event);
    }
  }

  emit<K extends keyof Events>(event: K, ...args: Events[K]) {
    const listeners = this.events.get(event);

    if (!listeners) return;

    for (const listener of listeners) {
      this.invokeListener(event, listener, args);
    }
  }

  async asyncEmit<K extends keyof Events>(event: K, ...args: Events[K]) {
    const listeners = this.events.get(event);
    if (!listeners) return;

    await Promise.all(
      [...listeners].map((listener) =>
        Promise.resolve(this.invokeListener(event, listener, args))
      )
    );
  }

  once<K extends keyof Events>(
    event: K,
    listener: (...args: Events[K]) => void
  ) {
    const wrapper = (...args: Events[K]) => {
      this.off(event, wrapper);
      this.invokeListener(event, listener, args);
    };

    return this.on(event, wrapper);
  }
}
