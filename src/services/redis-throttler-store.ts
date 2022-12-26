import { Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

export interface RedisThrottlerStore {
  /**
   * The redis instance.
   */
  redis: RedisClientType;

  /**
   * Get a record via its key and return all its request ttls.
   */
  getRecord(key: string): Promise<number[]>;

  /**
   * Add a record to the storage. The record will automatically be removed from
   * the storage once its TTL has been reached.
   */
  addRecord(key: string, ttl: number): Promise<void>;
}

@Injectable()
export class RedisThrottlerStoreService implements RedisThrottlerStore {
  redis: RedisClientType;

  constructor(redis: RedisClientType) {
    this.redis = redis;
  }

  async getRecord(key: string): Promise<number[]> {
    const setMembers = await this.redis.sMembers(`throttle:${key}`);
    const now = Date.now();

    // Clean expired members manually (to avoid extra memory usage)
    const expiredMembers = setMembers.filter((m: string) => parseInt(m) < now);
    if (expiredMembers.length) {
      await this.redis.sRem(`throttle:${key}`, expiredMembers);
    }

    return setMembers
      .filter((m: string) => parseInt(m) > now)
      .map((m: string) => parseInt(m))
      .sort();
  }

  async addRecord(key: string, ttl: number): Promise<void> {
    // add expiration timestamp to the set, and move set expiration forward
    const multi = this.redis.multi();
    multi.sAdd(`throttle:${key}`, (Date.now() + ttl * 1000).toString());
    multi.expire(`throttle:${key}`, ttl);
    await multi.exec();
  }
}
