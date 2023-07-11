# maria2

Modern & Simple RPC Library for aria2.

## Introduce
`maria2` can control `aria2c` by its [RPC interface](https://aria2.github.io/manual/en/html/aria2c.html#rpc-interface).

## Features
- Simple.
- Better TypeScript IDE Support.
- Browser and Node.js Support.

## Example
- Install this package
```sh
pnpm i maria2
```

- Start aria2 with rpc, example
```sh
aria2c --enable-rpc=true --rpc-listen-all=true --rpc-allow-origin-all=true --rpc-listen-port=6800
```


- Connect by WebSocket
```ts
import { openAsync, createWebSocket, aria2 } from 'maria2'

const conn = await openAsync(
  createWebSocket('ws://localhost:6800/jsonrpc')
)

const version = await aria2.getVersion(conn)
```

- Connect by HTTP
```ts
import { openAsync, createHTTP, aria2 } from 'maria2'

const conn = await openAsync(
  createHTTP('http://localhost:6800/jsonrpc')
)

const version = await aria2.getVersion(conn)
```

- Multicall
```ts
import { openAsync, createWebSocket, system } from 'maria2'

const conn = await openAsync(
  createWebSocket('ws://localhost:6800/jsonrpc')
)

const [result0, result1] = await system.multicall({
  methodName: 'aria2.getVersion',
  params: []
}, {
  methodName: 'aria2.getGlobalStat',
  params: []
})
```

## Thanks to
[@yjl9903](https://github.com/yjl9903)

## License
MIT License © 2023 [Hydration](https://github.com/hydrati)