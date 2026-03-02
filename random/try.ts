type EventMap = Record<string, any[]> & {
  error: unknown;
};

export class EventEmitter<Events extends EventMap> {
  private events;
  private maxListeners;

  constructor(maxListeners: number = 20) {
    this.events = new Map<keyof Events, Set<(...args: any[]) => void>>();
    this.maxListeners = maxListeners;
  }

  private invokeListner<K extends keyof Events>(
    event: K,
    listner: (...args: Events[K]) => void,
    args: Events[K]
  ) {
    try {
      listner(...args);
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

    const listeners = this.events.get(event);

    if (listeners!.size > this.maxListeners) {
      console.warn('Possible memory leak');
    }

    return () => this.off(event, listener);
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

    listeners.forEach((listener) => {
      listener(...args);
    });
  }

  once<K extends keyof Events>(
    event: K,
    listener: (...args: Events[K]) => void
  ) {
    const wrapper = (...args: Events[K]) => {
      this.off(event, wrapper);
      listener(...args);
    };

    return this.on(event, wrapper);
  }

  async asyncEmit<K extends keyof Events>(event: K, ...args: Events[K]) {
    const listeners = this.events.get(event);
    if (!listeners) return;

    await Promise.all(
      [...listeners].map((listener) => Promise.resolve(listener(...args)))
    );
  }

  listenerCount<K extends keyof Events>(event: K) {
    return this.events.get(event)?.size ?? 0;
  }

  removeAllListeners<K extends keyof Events>(event: K) {
    if (event) return this.events.delete(event);
    return this.events.clear();
  }
}
