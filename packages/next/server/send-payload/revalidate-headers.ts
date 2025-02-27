import type { ServerResponse } from 'http'
import type { BaseNextResponse } from '../base-http'
import type { PayloadOptions } from './index'

export function setRevalidateHeaders(
  res: ServerResponse | BaseNextResponse,
  options: PayloadOptions
) {
  if (options.private || options.stateful) {
    if (options.private || !res.hasHeader('Cache-Control')) {
      res.setHeader(
        'Cache-Control',
        `private, no-cache, no-store, max-age=0, must-revalidate`
      )
    }
  } else if (typeof options.revalidate === 'number') {
    if (options.revalidate < 1) {
      throw new Error(
        `invariant: invalid Cache-Control duration provided: ${options.revalidate} < 1`
      )
    }

    res.setHeader(
      'CDN-Cache-Control',
      `max-age=${options.revalidate}, stale-while-revalidate=1200`
    )
    res.setHeader(
      'Cache-Control',
      `public, s-maxage=${options.revalidate}, stale-while-revalidate=1200`
    )
  } else if (options.revalidate === false) {
    res.setHeader('CDN-Cache-Control', `max-age=31536000, stale-while-revalidate=31536000`)
    res.setHeader('Cache-Control', `public, s-maxage=31536000, stale-while-revalidate=31536000`)
  }
}
