import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { CacheManager } from "@/lib/cacheManager";

describe("CacheManager", () => {
  let cache: CacheManager;

  beforeEach(() => {
    cache = new CacheManager({
      name: "test-cache",
      version: 1,
    });
  });

  afterEach(async () => {
    await cache.clear();
  });

  describe("set and get", () => {
    it("stores and retrieves values", async () => {
      const key = "test-key";
      const value = { data: "test" };

      await cache.set(key, value);
      const retrieved = await cache.get(key);

      expect(retrieved).toEqual(value);
    });

    it("returns null for missing keys", async () => {
      const retrieved = await cache.get("non-existent");

      expect(retrieved).toBeNull();
    });

    it("stores various data types", async () => {
      const testCases = [
        { key: "string", value: "test string" },
        { key: "number", value: 42 },
        { key: "boolean", value: true },
        { key: "object", value: { nested: "object" } },
        { key: "array", value: [1, 2, 3] },
      ];

      for (const { key, value } of testCases) {
        await cache.set(key, value);
        const retrieved = await cache.get(key);
        expect(retrieved).toEqual(value);
      }
    });
  });

  describe("TTL (Time To Live)", () => {
    it("returns null for expired entries", async () => {
      const key = "ttl-key";
      const value = { data: "test" };
      const ttl = 50; // 50ms

      await cache.set(key, value, ttl);

      // Should be available immediately
      let retrieved = await cache.get(key);
      expect(retrieved).toEqual(value);

      // Wait for TTL to expire
      await new Promise(resolve => setTimeout(resolve, 100));

      // Should be expired now
      retrieved = await cache.get(key);
      expect(retrieved).toBeNull();
    });

    it("respects maxAge config", async () => {
      const cacheWithMaxAge = new CacheManager({
        name: "test-cache-maxage",
        version: 1,
        maxAge: 50,
      });

      const key = "maxage-key";
      const value = { data: "test" };

      await cacheWithMaxAge.set(key, value);

      // Should be available immediately
      let retrieved = await cacheWithMaxAge.get(key);
      expect(retrieved).toEqual(value);

      // Wait for maxAge to expire
      await new Promise(resolve => setTimeout(resolve, 100));

      // Should be expired now
      retrieved = await cacheWithMaxAge.get(key);
      expect(retrieved).toBeNull();

      await cacheWithMaxAge.clear();
    });
  });

  describe("delete", () => {
    it("removes cache entries", async () => {
      const key = "delete-key";
      const value = { data: "test" };

      await cache.set(key, value);
      let retrieved = await cache.get(key);
      expect(retrieved).toEqual(value);

      await cache.delete(key);
      retrieved = await cache.get(key);
      expect(retrieved).toBeNull();
    });
  });

  describe("clear", () => {
    it("removes all cache entries", async () => {
      await cache.set("key1", "value1");
      await cache.set("key2", "value2");
      await cache.set("key3", "value3");

      const keys = await cache.keys();
      expect(keys.length).toBe(3);

      await cache.clear();

      const keysAfter = await cache.keys();
      expect(keysAfter.length).toBe(0);
    });
  });

  describe("maxSize", () => {
    it("enforces maximum cache size", async () => {
      const smallCache = new CacheManager({
        name: "small-cache",
        version: 1,
        maxSize: 2,
      });

      await smallCache.set("key1", "value1");
      await smallCache.set("key2", "value2");
      await smallCache.set("key3", "value3"); // Should evict key1

      let size = smallCache.size();
      expect(size).toBeLessThanOrEqual(2);

      const retrieved1 = await smallCache.get("key1");
      expect(retrieved1).toBeNull(); // Should be evicted

      await smallCache.clear();
    });
  });

  describe("keys", () => {
    it("returns all cache keys", async () => {
      await cache.set("key1", "value1");
      await cache.set("key2", "value2");
      await cache.set("key3", "value3");

      const keys = await cache.keys();

      expect(keys).toContain("key1");
      expect(keys).toContain("key2");
      expect(keys).toContain("key3");
      expect(keys.length).toBe(3);
    });
  });

  describe("size", () => {
    it("returns number of entries", async () => {
      expect(cache.size()).toBe(0);

      await cache.set("key1", "value1");
      expect(cache.size()).toBe(1);

      await cache.set("key2", "value2");
      expect(cache.size()).toBe(2);

      await cache.delete("key1");
      expect(cache.size()).toBe(1);
    });
  });

  describe("persistence", () => {
    it("persists entries to localStorage", async () => {
      const key = "persist-key";
      const value = { persistent: "data" };

      await cache.set(key, value);

      // Create new cache instance
      const cache2 = new CacheManager({
        name: "test-cache",
        version: 1,
      });

      // Should retrieve from localStorage
      const retrieved = await cache2.get(key);
      expect(retrieved).toEqual(value);

      await cache2.clear();
    });
  });
});
