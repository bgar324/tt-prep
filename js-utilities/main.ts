// debounce
// throttle
// once
// memoize
// deep clone
// curry
// promise.all
// compose
// pipe
// event emitter
// my promise
// ---------------------------------------------------------------------------------

// debounce : delays function execution until after it stops being triggered for delay
function debounce<T extends (...args: any[]) => any>(fn: T, delay: number) {
  let timer: any;
  return function (...args: Parameters<T>) {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// throttle : ensures functions run at most once per delay
function throttle<T extends (...args: any[]) => any>(fn: T, delay: number) {
  let last = 0;
  return function (...args: Parameters<T>) {
    const now = Date.now();
    if (now - last >= delay) {
      last = now;
      fn(...args);
    }
  };
}

// once : runs a function only once. future calls return the first result.
function once<T extends (...args: any[]) => any>(fn: T) {
  let called = false;
  let result: ReturnType<T>;
  return function (...args: Parameters<T>) {
    if (!called) {
      called = true;
      result = fn(...args);
    }
    return result;
  };
}

// memoize : caches results based on arguments. if the function is called w/ the same args, return the cached value.
function memoize<T extends (...args: any[]) => any>(fn: T) {
  const cache = new Map<string, ReturnType<T>>();
  return function (...args: Parameters<T>) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const res = fn(...args);
    cache.set(key, res);
    return res;
  };
}

// deepclone : creates a recursively deep copy of any object, with cycle detection
function deepClone<T>(obj: T, seen = new Map<any, any>()): T {
  if (obj === null || typeof obj !== "object") return obj;
  if (seen.has(obj)) return seen.get(obj);

  const clone: any = Array.isArray(obj) ? [] : {};
  seen.set(obj, clone);

  for (const key in obj) clone[key] = deepClone((obj as any)[key], seen);
  return clone;
}

// curry : transforms a function so it can be partially appled until it receives all arguments
function curry(fn: Function) {
  return function curried(...args: any[]) {
    if (args.length >= fn.length) return fn(...args);
    return (...next: any[]) => curried(...args, ...next);
  };
}

// compose : evaluates functions from right to left
function compose(...fns: Function[]) {
  return (x: any) => fns.reduceRight((v, f) => f(v), x);
}

// pipe : evaluates functions from left to right
function pipe(...fns: Function[]) {
  return (x: any) => fns.reduce((v, f) => f(v), x);
}

// promiseAll : implements Promise.all : resolves when all promises resolve, rejects else
function promiseAll<T>(promises: Iterable<T | Promise<T>>): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const arr = Array.from(promises);
    const results: T[] = [];
    let count = 0;

    if (arr.length === 0) return resolve([]);

    arr.forEach((p, i) => {
      Promise.resolve(p).then(
        (val) => {
          results[i] = val;
          if (++count === arr.length) resolve(results);
        },
        (err) => reject(err)
      );
    });
  });
}

// eventemitter : simple pub/sub w/ on,off,once,emit
class EventEmiter {
  private events = new Map<string, Set<(...args: any[]) => void>>();

  on(event: string, listener: (...args: any[]) => void) {
    if (!this.events.has(event)) this.events.set(event, new Set());
    this.events.get(event)!.add(listener);
  }

  off(event: string, listener: (...args: any[]) => void) {
    this.events.get(event)?.delete(listener);
  }

  once(event: string, listener: (...args: any[]) => void) {
    const wrap = (...args: any[]) => {
      listener(...args);
      this.off(event, wrap);
    };
    this.on(event, wrap);
  }

  emit(event: string, ...args: any[]) {
    this.events.get(event)?.forEach((fn) => fn(...args));
  }
}

// lru cache : least recently used.

class LRUCache {
  private capacity: number;
  private cache: Map<number, number>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key: number): number {
    const value = this.cache.get(key);
    if (value === undefined) {
      return -1;
    }

    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key: number, value: number): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    this.cache.set(key, value);

    if (this.cache.size > this.capacity) {
      const firstEntry = this.cache.keys().next();
      if (!firstEntry.done) {
        this.cache.delete(firstEntry.value);
      }
    }
  }
}


