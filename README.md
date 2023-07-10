# maria2

Modern & Simple RPC Library for aria2c

## Example
```ts
import { openAsync, createWebSocket, aria2 } from 'maria2'

const conn = await openAsync(
  createWebSocket('ws://localhost:6800/jsonrpc')
)

await aria2.getVersion(conn)
```