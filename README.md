# maria2

Modern & Simple RPC Library for aria2.

## Introduce
`maria2` can control `aria2c` by its [RPC interface](https://aria2.github.io/manual/en/html/aria2c.html#rpc-interface).

## Features
- Simple.
- Better TypeScript IDE Support.
- Browser and Node.js Support.

## Getting Started

- If you are using Deno, just import it.
```ts
// See https://deno.land/x/maria2
import { open, aria2, system } from 'https://deno.land/x/maria2/index.ts'
```

- If you are using Node.js, install this package.
```sh
pnpm i maria2

# For Node.js *
pnpm i ws
pnpm i -D @types/ws # TypeScript Support

# For Node.js <v15.6.0, <v14.17.0
pnpm i uuid
```

- Run `aria2c` with RPC options, for example
```sh
aria2c --enable-rpc=true --rpc-listen-all=true --rpc-allow-origin-all=true --rpc-listen-port=6800
```

- Connect by WebSocket
```ts
import { open, aria2 } from 'maria2'

const conn = await open(
  new WebSocket('ws://localhost:6800/jsonrpc')

  // import { createWebSocket } from 'maria2'
  // createWebSocket('ws://localhost:6800/jsonrpc')
)

const version = await aria2.getVersion(conn)
```

- Connect by HTTP
```ts
import { open, createHTTP, aria2 } from 'maria2'

const conn = await open(
  createHTTP('http://localhost:6800/jsonrpc')
)

const version = await aria2.getVersion(conn)
```

- Multicall
```ts
import { open, system } from 'maria2'

const conn = await open(
  new WebSocket('ws://localhost:6800/jsonrpc')
)

const [result0, result1] = await system.multicall({
  methodName: 'aria2.getVersion',
  params: []
}, {
  methodName: 'aria2.getGlobalStat',
  params: []
})
```

## Credits
- [XLor (@yjl9903)](https://github.com/yjl9903)
- [L0serj3rry (@Cnotech)](https://github.com/Cnotech)

## License
MIT License © 2023 [Hydration](https://github.com/hydrati)