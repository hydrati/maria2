export const randomUUID = await (async () => {
  const nodeCrypto = await import('node:crypto')
  if (nodeCrypto?.randomUUID != null) {
    return () => nodeCrypto.randomUUID()
  }

  const uuidV4 = (await import('uuid'))?.v4
  if (uuidV4 != null) {
    return () => uuidV4()
  }
})()

export const httpPost = await (async () => {
  const { request } = await import('node:http')
  const { Buffer } = await import('node:buffer')

  return (url: string, json: string) =>
    new Promise<string>((onResolve, onReject) => {
      const req = request(
        url,
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'content-length': Buffer.byteLength(json),
          },
        },
        async (res) => {
          // dynamic import decoder
          const { decodeMessageData } = await import('./decode.ts')

          res.setEncoding('utf8')

          const chunks: any[] = []
          res.on('data', (chunk) => chunks.push(chunk))
          res.on('end', () => onResolve(decodeMessageData(chunks)))
        }
      )

      req.once('error', onReject)

      req.write(json)
      req.end()
    })
})()
