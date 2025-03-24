import { Ratelimit } from '@upstash/ratelimit'
import { kv } from '@vercel/kv'

export const messageRateLimiter = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(5, '10s'),
  analytics: true,
})

export const chatJoinRateLimiter = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(2, '10s'),
  analytics: true,
})

export const feedbackRateLimiter = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(1, '60s'),
  analytics: true,
})
