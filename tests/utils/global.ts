import WebSocket from 'ws'
import { vi, beforeAll } from 'vitest'

beforeAll(() => {
  vi.stubGlobal('WebSocket', WebSocket)
})
