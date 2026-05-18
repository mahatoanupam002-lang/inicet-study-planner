export type CacheStrategy = "cache-first" | "network-first" | "stale-while-revalidate" | "network-only";

export interface CacheConfig {
  name: string;
  version: number;
  maxAge?: number; // milliseconds
  maxSize?: number; // number of items
}

export interface CacheEntry {
  key: string;
  value: unknown;
  timestamp: number;
  ttl?: number;
}

/**
 * Simple cache manager for IndexedDB or localStorage
 */
export class CacheManager {
  private config: CacheConfig;
  private cache: Map<string, CacheEntry> = new Map();
  private dbName: string;

  constructor(config: CacheConfig) {
    this.config = config;
    this.dbName = `${config.name}_v${config.version}`;
  }

  /**
   * Set a cache entry
   */
  async set(key: string, value: unknown, ttl?: number): Promise<void> {
    const entry: CacheEntry = {
      key,
      value,
      timestamp: Date.now(),
      ttl,
    };

    this.cache.set(key, entry);

    // Also persist to localStorage for basic caching
    try {
      localStorage.setItem(
        `${this.dbName}:${key}`,
        JSON.stringify(entry)
      );
    } catch (error) {
      console.warn("Failed to persist cache entry:", error);
    }

    // Enforce max size
    if (this.config.maxSize && this.cache.size > this.config.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
        localStorage.removeItem(`${this.dbName}:${firstKey}`);
      }
    }
  }

  /**
   * Get a cache entry
   */
  async get(key: string): Promise<unknown | null> {
    // Check memory cache first
    const entry = this.cache.get(key);

    if (!entry) {
      // Try to load from localStorage
      try {
        const stored = localStorage.getItem(`${this.dbName}:${key}`);
        if (stored) {
          const parsed = JSON.parse(stored) as CacheEntry;
          this.cache.set(key, parsed);
          return this.checkAndReturnEntry(parsed);
        }
      } catch (error) {
        console.warn("Failed to load cache entry:", error);
      }
      return null;
    }

    return this.checkAndReturnEntry(entry);
  }

  /**
   * Delete a cache entry
   */
  async delete(key: string): Promise<void> {
    this.cache.delete(key);
    try {
      localStorage.removeItem(`${this.dbName}:${key}`);
    } catch (error) {
      console.warn("Failed to delete cache entry:", error);
    }
  }

  /**
   * Clear all cache entries
   */
  async clear(): Promise<void> {
    this.cache.clear();

    // Clear from localStorage
    try {
      const keys = Object.keys(localStorage);
      for (const key of keys) {
        if (key.startsWith(`${this.dbName}:`)) {
          localStorage.removeItem(key);
        }
      }
    } catch (error) {
      console.warn("Failed to clear cache:", error);
    }
  }

  /**
   * Get all keys in cache
   */
  async keys(): Promise<string[]> {
    return Array.from(this.cache.keys());
  }

  /**
   * Check if entry is valid and return value
   */
  private checkAndReturnEntry(entry: CacheEntry): unknown | null {
    // Check TTL
    if (entry.ttl !== undefined) {
      const age = Date.now() - entry.timestamp;
      if (age > entry.ttl) {
        this.cache.delete(entry.key);
        return null;
      }
    }

    // Check max age
    if (this.config.maxAge !== undefined) {
      const age = Date.now() - entry.timestamp;
      if (age > this.config.maxAge) {
        this.cache.delete(entry.key);
        return null;
      }
    }

    return entry.value;
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }
}

/**
 * Fetch with cache strategy
 */
export async function fetchWithCache(
  url: string,
  strategy: CacheStrategy = "network-first",
  cache?: CacheManager
): Promise<Response> {
  switch (strategy) {
    case "cache-first":
      return cacheFirstStrategy(url, cache);
    case "network-first":
      return networkFirstStrategy(url, cache);
    case "stale-while-revalidate":
      return staleWhileRevalidateStrategy(url, cache);
    case "network-only":
      return fetch(url);
    default:
      return fetch(url);
  }
}

/**
 * Cache-first strategy: try cache first, fallback to network
 */
async function cacheFirstStrategy(
  url: string,
  cache?: CacheManager
): Promise<Response> {
  if (cache) {
    const cached = await cache.get(url);
    if (cached instanceof Response) {
      return cached.clone();
    }
  }

  const response = await fetch(url);
  if (cache && response.ok) {
    await cache.set(url, response.clone());
  }

  return response;
}

/**
 * Network-first strategy: try network first, fallback to cache
 */
async function networkFirstStrategy(
  url: string,
  cache?: CacheManager
): Promise<Response> {
  try {
    const response = await fetch(url);
    if (cache && response.ok) {
      await cache.set(url, response.clone());
    }
    return response;
  } catch (error) {
    if (cache) {
      const cached = await cache.get(url);
      if (cached instanceof Response) {
        return cached.clone();
      }
    }
    throw error;
  }
}

/**
 * Stale-while-revalidate: return cache immediately, update in background
 */
async function staleWhileRevalidateStrategy(
  url: string,
  cache?: CacheManager
): Promise<Response> {
  if (cache) {
    const cached = await cache.get(url);
    if (cached instanceof Response) {
      // Return cached response and update in background
      fetch(url)
        .then(response => {
          if (response.ok) {
            cache.set(url, response.clone());
          }
        })
        .catch(console.warn);

      return cached.clone();
    }
  }

  const response = await fetch(url);
  if (cache && response.ok) {
    await cache.set(url, response.clone());
  }

  return response;
}
