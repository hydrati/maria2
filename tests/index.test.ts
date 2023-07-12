import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('without global', async () => {
  beforeEach(() => {
    vi.stubGlobal('WebSocket', void 0)
    vi.stubGlobal('fetch', void 0)
    vi.stubGlobal('crypto', void 0)
  })

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

describe('normal', async () => {
  beforeEach(async () => {
    vi.stubGlobal('WebSocket', (await import('ws')).default)
  })

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
