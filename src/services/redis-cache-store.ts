import type { Config, Store } from 'cache-manager';
import { RedisClientType } from 'redis';

export class RedisCacheStore implements Store {
  private readonly redisClient: RedisClientType;
  private readonly options?: Config;

  constructor(redisClient: RedisClientType, options?: Config) {
    this.redisClient = redisClient;
    this.options = options;
  }

  // PRIVATE METHODS
  private isCacheable(value) {
    return this.options?.isCacheable || (value !== undefined && value !== null);
  }

  private getVal(value: unknown) {
    return JSON.stringify(value) || '"undefined"';
  }

  // SET
  async set(key, value, ttl) {
    if (!this.isCacheable(value))
      throw new Error(`"${value}" is not a cacheable value`);
    const t = ttl === undefined ? this.options?.ttl : ttl;
    const ttlOptions = t !== undefined ? { PX: t } : undefined;
    await this.redisClient.set(key, this.getVal(value), ttlOptions);
  }

  async mset(args, ttl) {
    const t = ttl === undefined ? this.options?.ttl : ttl;
    if (t !== undefined) {
      const multi = this.redisClient.multi();
      for (const [key, value] of args) {
        if (!this.isCacheable(value))
          throw new Error(`"${this.getVal(value)}" is not a cacheable value`);
        multi.set(key, this.getVal(value), { PX: t });
      }
      await multi.exec();
    } else
      await this.redisClient.mSet(
        args.map(([key, value]) => {
          if (!this.isCacheable(value))
            throw new Error(`"${this.getVal(value)}" is not a cacheable value`);
          return [key, this.getVal(value)] as [string, string];
        }),
      );
  }

  // GET
  async get<T>(key: string) {
    const val = await this.redisClient.get(key);
    if (val === undefined || val === null) return undefined;
    else return JSON.parse(val) as T;
  }

  async mget(...args) {
    return await this.redisClient
      .mGet(args)
      .then((x) =>
        x.map((x) =>
          x === null || x === undefined
            ? undefined
            : (JSON.parse(x) as unknown),
        ),
      );
  }

  // DELETE
  async del(key) {
    await this.redisClient.del(key);
  }

  async mdel(...args) {
    await this.redisClient.del(args);
  }

  // TTL
  async ttl(key) {
    return this.redisClient.pTTL(key);
  }

  // KEYS
  async keys(pattern: string) {
    return await this.redisClient.keys(pattern);
  }

  // RESET
  async reset() {
    const keys = await this.keys('cache:*');
    await this.redisClient.del(keys);
  }
}
