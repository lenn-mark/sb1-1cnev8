import { Request, Response, NextFunction } from 'express';
import { RateLimiter } from './rate-limiter';

const rateLimiter = new RateLimiter({
  points: 100,        // 100 requests
  duration: 60,       // per 60 seconds
  blockDuration: 600, // Block for 10 minutes if exceeded
});

export async function rateLimitMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const apiKey = req.headers.authorization?.replace('Bearer ', '') || 'anonymous';
  
  try {
    await rateLimiter.consume(apiKey);
    
    const limits = await rateLimiter.get(apiKey);
    res.setHeader('X-RateLimit-Remaining', limits.remainingPoints.toString());
    res.setHeader('X-RateLimit-Reset', Math.ceil(limits.msBeforeNext / 1000).toString());
    
    next();
  } catch (error) {
    res.status(429).json({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please try again later.',
    });
  }
}