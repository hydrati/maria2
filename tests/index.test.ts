import { describe, expect, it } from 'vitest'
import { openAsync, aria2, system } from '..'
import { WebSocket } from 'isomorphic-ws'

describe('aria2', async () => {
  it('should work', async () => {
    const socket = new WebSocket('ws://localhost:6800/jsonrpc')
    const conn = await openAsync(socket)
    expect(await aria2.getVersion(conn))
      .property('enabledFeatures')
      .satisfies(Array.isArray)
  })
})
