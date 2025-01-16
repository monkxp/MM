interface CacheItem<T> {
  value: T;
  timestamp: number;
  expiresIn: number;
}

class Cache {
  private cache: Map<string, CacheItem<any>>;
  private static instance: Cache;

  private constructor() {
    this.cache = new Map();
    // Cleanup expired items periodically
    setInterval(() => this.cleanup(), 60 * 1000); // Run cleanup every minute
  }

  public static getInstance(): Cache {
    if (!Cache.instance) {
      Cache.instance = new Cache();
    }
    return Cache.instance;
  }

  set(key: string, value: any, expiresIn: number = 5 * 60 * 1000) {
    // Store in localStorage for persistence
    const item = {
      value,
      timestamp: Date.now(),
      expiresIn,
    };

    this.cache.set(key, item);
    localStorage.setItem(`cache_${key}`, JSON.stringify(item));
  }

  get(key: string) {
    // Try memory cache first
    let item = this.cache.get(key);

    // If not in memory, try localStorage
    if (!item) {
      const stored = localStorage.getItem(`cache_${key}`);
      if (stored) {
        item = JSON.parse(stored);
        this.cache.set(key, item as CacheItem<any>);
      }
    }

    if (!item) return null;

    const isExpired = Date.now() > item.timestamp + item.expiresIn;
    if (isExpired) {
      this.delete(key);
      return null;
    }

    return item.value;
  }

  private delete(key: string) {
    this.cache.delete(key);
    localStorage.removeItem(`cache_${key}`);
  }

  clear() {
    this.cache.clear();
    // Clear only cache-related items from localStorage
    Object.keys(localStorage)
      .filter((key) => key.startsWith("cache_"))
      .forEach((key) => localStorage.removeItem(key));
  }

  private cleanup() {
    for (const [key, item] of this.cache.entries()) {
      if (Date.now() > item.timestamp + item.expiresIn) {
        this.delete(key);
      }
    }
  }
}

// Export a singleton instance
const cache = Cache.getInstance();
export default cache;
