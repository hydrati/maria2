import { describe, expect, it } from 'vitest'

describe('maria2', async () => {
  it('createWebSocket should work', async () => {
    const { open, close, aria2, ReadyState } = await import('../src')
    const { createWebSocket } = await import('../src/transport')

    const socket = createWebSocket('ws://localhost:6800/jsonrpc')
    const conn = await open(socket, { secret: '123456' })

    expect(await aria2.getVersion(conn))
      .property('enabledFeatures')
      .satisfies(Array.isArray)

    close(conn)
    expect(socket.readyState).oneOf([ReadyState.Closing, ReadyState.Closed])
  })

  it('createHTTP should work', async () => {
    const { open, close, aria2, ReadyState } = await import('../src')
    const { createHTTP } = await import('../src/transport')

    const socket = createHTTP('http://localhost:6800/jsonrpc')
    const conn = await open(socket, { secret: '123456' })
    expect(await aria2.getVersion(conn))
      .property('enabledFeatures')
      .satisfies(Array.isArray)

    close(conn)

    expect(socket.readyState).oneOf([ReadyState.Closing, ReadyState.Closed])
  })

  it('createWebSocket(pre) should work', async () => {
    const { open, close, aria2, ReadyState } = await import('../src')
    const { createWebSocket } = await import('../src/transport')

    const socket = createWebSocket('ws://localhost:6800/jsonrpc', {
      secret: '123456',
    })
    const conn = await open(socket)

    expect(await aria2.getVersion(conn))
      .property('enabledFeatures')
      .satisfies(Array.isArray)

    close(conn)
    expect(socket.readyState).oneOf([ReadyState.Closing, ReadyState.Closed])
  })

  it('createHTTP(pre) should work', async () => {
    const { open, close, aria2, ReadyState } = await import('../src')
    const { createHTTP } = await import('../src/transport')

    const socket = createHTTP('http://localhost:6800/jsonrpc', {
      secret: '123456',
    })
    const conn = await open(socket)
    expect(await aria2.getVersion(conn))
      .property('enabledFeatures')
      .satisfies(Array.isArray)

    close(conn)

    expect(socket.readyState).oneOf([ReadyState.Closing, ReadyState.Closed])
  })
})
