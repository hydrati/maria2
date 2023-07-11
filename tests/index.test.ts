import { describe, expect, it } from 'vitest'

describe('aria2', async () => {
  it('createWebSocket should work', async () => {
    const { open, createWebSocket, aria2, system } = await import('..')

    const socket = createWebSocket('ws://localhost:6800/jsonrpc')
    const conn = await open(socket)
    expect(await aria2.getVersion(conn))
      .property('enabledFeatures')
      .satisfies(Array.isArray)
  })

  it('createHTTP should work', async () => {
    const { openAsync, createHTTP, aria2, system } = await import('..')

    const socket = createHTTP('http://localhost:6800/jsonrpc')
    const conn = await openAsync(socket)
    expect(await aria2.getVersion(conn))
      .property('enabledFeatures')
      .satisfies(Array.isArray)
  })
})
