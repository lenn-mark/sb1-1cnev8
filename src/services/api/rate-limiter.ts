import { RateLimiterMemory } from 'rate-limiter-flexible';

export interface RateLimitConfig {
  points: number;      // Number of points
  duration: number;    // Per duration in seconds
  blockDuration?: number; // Block duration in seconds
}

export class RateLimiter {
  private limiter: RateLimiterMemory;

  constructor(config: RateLimitConfig) {
    this.limiter = new RateLimiterMemory({
      points: config.points,
      duration: config.duration,
      blockDuration: config.blockDuration,
    });
  }

  async consume(key: string, points: number = 1): Promise<void> {
    try {
      await this.limiter.consume(key, points);
    } catch (error) {
      throw new Error('Rate limit exceeded');
    }
  }

  async get(key: string): Promise<{
    remainingPoints: number;
    msBeforeNext: number;
  }> {
    const res = await this.limiter.get(key);
    return {
      remainingPoints: res ? Math.max(0, this.limiter.points - res.consumedPoints) : this.limiter.points,
      msBeforeNext: res ? res.msBeforeNext : 0,
    };
  }

  async reset(key: string): Promise<void> {
    await this.limiter.delete(key);
  }
}