import { describe, expect, it } from 'vitest'
import { openAsync, createWebSocket, aria2, system } from '..'

describe('aria2', async () => {
  it('should work', async () => {
    const socket = createWebSocket('ws://localhost:6800/jsonrpc')
    const conn = await openAsync(socket)
    expect(await aria2.getVersion(conn))
      .property('enabledFeatures')
      .satisfies(Array.isArray)
  })
})
