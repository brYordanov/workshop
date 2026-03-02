type EventMapWithError = Record<string, any[]> & {
  error: [unknown];
};
type Listener = (...args: any[]) => void;

export class EventEmitter<Events extends EventMapWithError> {
  private maxListeners: number;
  private events = new Map<keyof Events, Set<Listener>>();
  constructor(maxListeners = 20) {
    this.maxListeners = maxListeners;
  }

  private invokeListener<K extends keyof Events>(
    event: K,
    listener: (...args: Events[K]) => void,
    args: Events[K]
  ) {
    try {
      listener(...args);
    } catch (err) {
      if (event != 'error' && this.events.has('error')) {
        const error = err instanceof Error ? err : new Error(String(err));
        this.emit('error', error);
      } else {
        throw err;
      }
    }
  }

  on<K extends keyof Events>(
    event: K,
    listener: (...args: Events[K]) => void
  ): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    const listeners = this.events.get(event)!;

    listeners.add(listener);

    if (listeners.size > this.maxListeners) {
      console.warn(
        `Possible memory leak: "${String(event)}" has ${listeners.size} listeners`
      );
    }

    return () => this.off(event, listener);
  }

  off<K extends keyof Events>(
    event: K,
    listener: (...args: Events[K]) => void
  ): void {
    const listeners = this.events.get(event);

    if (!listeners) throw new Error('no listeners for event');

    listeners.delete(listener);

    if (listeners.size === 0) {
      this.events.delete(event);
    }
  }

  emit<K extends keyof Events>(event: K, ...args: Events[K]): void {
    const listeners = this.events.get(event);

    if (!listeners) throw new Error('no listeners for event');

    for (const listener of [...listeners]) {
      this.invokeListener(event, listener, args);
    }
  }

  once<K extends keyof Events>(
    event: K,
    listener: (...args: Events[K]) => void
  ): () => void {
    const wrapper = (...args: Events[K]) => {
      this.off(event, wrapper);
      this.invokeListener(event, listener, args);
    };

    return this.on(event, wrapper);
  }

  async asyncEmit<K extends keyof Events>(
    event: K,
    ...args: Events[K]
  ): Promise<void> {
    const listeners = this.events.get(event);
    if (!listeners) throw new Error('no listener for event');

    await Promise.all(
      [...listeners].map((listener) =>
        Promise.resolve(this.invokeListener(event, listener, args))
      )
    );
  }

  listenerCount<K extends keyof Events>(event: K): number {
    return this.events.get(event)?.size ?? 0;
  }

  removeAllListeners<K extends keyof Events>(event?: K): void {
    if (event) this.events.delete(event);
    else this.events.clear();
  }
}

type ChatEvents = {
  message: [from: string, content: string];
  join: [username: string];
  error: [err: Error];
};

const chat = new EventEmitter<ChatEvents>();
chat.on('message', (from, msg) => {
  console.log(`${from}: ${msg}`);
});
chat.emit('message', 'Alice', 'Hello world');
