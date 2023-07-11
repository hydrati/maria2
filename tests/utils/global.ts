import WebSocket from 'ws'
import { vi, beforeAll } from 'vitest'
import { webcrypto } from 'crypto'

beforeAll(() => {
  vi.stubGlobal('WebSocket', WebSocket)
  vi.stubGlobal('crypto', webcrypto)
})
