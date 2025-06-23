# maria2

Modern & Simple RPC Library for aria2.

## Introduce
`maria2` can control `aria2c` by its [RPC interface](https://aria2.github.io/manual/en/html/aria2c.html#rpc-interface).

## Features
- Simple and Light (Just `4.12KB` after minified)
- Better TypeScript IDE Support.
- Browser and Node.js Support.

## Getting Started

- Install
```sh
bun i maria2

pnpm i maria2

yarn add maria2

npm i maria2
```

- Run `aria2c` with RPC options, for example
```sh
aria2c --enable-rpc=true --rpc-listen-all=true --rpc-allow-origin-all=true --rpc-listen-port=6800
```

- Connect by WebSocket
```ts
import { aria2, close, createWebSocket, open } from 'maria2'

const conn = await open(createWebSocket('ws://localhost:6800/jsonrpc'))

const version = await aria2.getVersion(conn)

console.log(version)

close(conn)
```

- Connect by HTTP
```ts
import { aria2, close, createHTTP, open } from '.'

const conn = await open(createHTTP('ws://localhost:6800/jsonrpc'))

const version = await aria2.getVersion(conn)

console.log(version)

close(conn)
```

- Multicall
```ts
import { close, open, system } from 'maria2'

const conn = await open(
  new WebSocket('ws://localhost:6800/jsonrpc')
)

// All typed
const [result0, result1] = await system.multicall({
  methodName: 'aria2.getVersion',
  params: []
}, {
  methodName: 'aria2.getGlobalStat',
  params: []
})

close(conn)
```

## Credits
- [XLor (@yjl9903)](https://github.com/yjl9903)
- [L0serj3rry (@Cnotech)](https://github.com/Cnotech)

## License
MIT License © 2023-present [Hydration](https://github.com/hydrati)
