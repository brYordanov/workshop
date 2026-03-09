import {
  CanActivate,
  ExecutionContext,
  Injectable,
  OnModuleDestroy,
  SetMetadata,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'

interface WindowEntry {
  count: number
  windowStart: number
}

@Injectable()
export class FixedWindowRateLimiter implements CanActivate, OnModuleDestroy {
  private stores = new Map<string, Map<string, WindowEntry>>()
  private intervals = new Map<string, NodeJS.Timeout>()

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const config = this.reflector.get<{ limit: number; windowMs: number }>(
      'rateLimit',
      context.getHandler(),
    )

    if (!config) return true
    const { limit, windowMs } = config
    const req = context.switchToHttp().getRequest<Request>()
    const key = req.ip!
    const storeKey = `${limit}:${windowMs}`

    if (!this.stores.has(storeKey)) {
      this.stores.set(storeKey, new Map())
      this.intervals.set(
        storeKey,
        setInterval(() => {
          this.cleanUp(storeKey, windowMs)
        }, windowMs),
      )
    }

    const store = this.stores.get(storeKey)!

    return this.checkLimit(store, key, limit, windowMs)
  }

  private checkLimit(
    store: Map<string, WindowEntry>,
    key: string,
    limit: number,
    windowMs: number,
  ): boolean {
    const now = Date.now()
    const entry = store.get(key)

    if (!entry || now - entry.windowStart >= windowMs) {
      store.set(key, { count: 1, windowStart: now })
      return true
    }

    if (entry?.count >= limit) {
      return false
    }

    entry.count++

    return true
  }

  private cleanUp(storeKey: string, windowMs: number): void {
    const store = this.stores.get(storeKey)
    if (!store) return

    const now = Date.now()

    for (const [key, entry] of store.entries()) {
      if (now - entry.windowStart >= windowMs) {
        store.delete(key)
      }
    }
  }

  onModuleDestroy(): void {
    for (const interval of this.intervals.values()) {
      clearInterval(interval)
    }
  }
}

export const RateLimit = (limit: number, windowMs: number) =>
  SetMetadata('rateLimit', { limit, windowMs })
