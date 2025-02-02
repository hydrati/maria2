import { describe, expect, it } from 'bun:test'

describe('maria2', async () => {
  it('createWebSocket should work', async () => {
    const { open, close, aria2, ReadyState } = await import('../src')
    const { createWebSocket } = await import('../src/transport')

    const socket = createWebSocket('ws://localhost:6800/jsonrpc')
    const conn = await open(socket, { secret: '123456' })

    const result = await aria2.getVersion(conn)
    expect(result).toHaveProperty('enabledFeatures')
    expect(result.enabledFeatures).toBeArray()

    close(conn)

    expect(socket.readyState).toSatisfy(x => [ReadyState.Closing, ReadyState.Closed].includes(x))
  })

  it('createHTTP should work', async () => {
    const { open, close, aria2, ReadyState } = await import('../src')
    const { createHTTP } = await import('../src/transport')

    const socket = createHTTP('http://localhost:6800/jsonrpc')
    const conn = await open(socket, { secret: '123456' })

    const result = await aria2.getVersion(conn)
    expect(result).toHaveProperty('enabledFeatures')
    expect(result.enabledFeatures).toBeArray()

    close(conn)

    expect(socket.readyState).toSatisfy(x => [ReadyState.Closing, ReadyState.Closed].includes(x))
  })

  it('createWebSocket(pre) should work', async () => {
    const { open, close, aria2, ReadyState } = await import('../src')
    const { createWebSocket } = await import('../src/transport')

    const socket = createWebSocket('ws://localhost:6800/jsonrpc', {
      secret: '123456',
    })
    const conn = await open(socket)

    const result = await aria2.getVersion(conn)
    expect(result).toHaveProperty('enabledFeatures')
    expect(result.enabledFeatures).toBeArray()

    close(conn)

    expect(socket.readyState).toSatisfy(x => [ReadyState.Closing, ReadyState.Closed].includes(x))
  })

  it('createHTTP(pre) should work', async () => {
    const { open, close, aria2, ReadyState } = await import('../src')
    const { createHTTP } = await import('../src/transport')

    const socket = createHTTP('http://localhost:6800/jsonrpc', {
      secret: '123456',
    })
    const conn = await open(socket)

    const result = await aria2.getVersion(conn)
    expect(result).toHaveProperty('enabledFeatures')
    expect(result.enabledFeatures).toBeArray()

    close(conn)

    expect(socket.readyState).toSatisfy(x => [ReadyState.Closing, ReadyState.Closed].includes(x))
  })
})
