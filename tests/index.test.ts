import { describe, expect, it } from 'vitest'

describe('aria2', async () => {
  it('createWebSocket should work', async () => {
    const { open, close, createWebSocket, aria2, ReadyState } = await import(
      '../src'
    )

    const socket = createWebSocket('ws://localhost:6800/jsonrpc')
    const conn = await open(socket)
    expect(await aria2.getVersion(conn))
      .property('enabledFeatures')
      .satisfies(Array.isArray)

    close(conn)
    expect(socket.readyState).oneOf([ReadyState.Closing, ReadyState.Closed])
  })

  it('createHTTP should work', async () => {
    const { open, createHTTP, aria2, system, close, ReadyState } = await import(
      '../src'
    )

    const socket = createHTTP('http://localhost:6800/jsonrpc')
    const conn = await open(socket)
    expect(await aria2.getVersion(conn))
      .property('enabledFeatures')
      .satisfies(Array.isArray)

    close(conn)

    expect(socket.readyState).oneOf([ReadyState.Closing, ReadyState.Closed])
  })
})
