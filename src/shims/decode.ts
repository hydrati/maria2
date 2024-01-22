export const decodeMessageData = (data: any) => {
  if (typeof data == 'string') {
    return data
  } else if (data instanceof Uint8Array || data instanceof ArrayBuffer) {
    return new TextDecoder().decode(data)
  } else if (data.buffer instanceof ArrayBuffer) {
    return new TextDecoder().decode(data.buffer)
  } else if (Array.isArray(data)) {
    const out: string[] = []
    const decoder = new TextDecoder()
    for (const chunk of data) {
      if (typeof chunk == 'string') {
        out.push(chunk)
      } else if (chunk instanceof Uint8Array || chunk instanceof ArrayBuffer) {
        out.push(decoder.decode(chunk))
      } else if (chunk.buffer instanceof ArrayBuffer) {
        out.push(decoder.decode(chunk.buffer))
      }
    }
    return out.join('')
  } else {
    throw new Error('[maria2 error] Message data cannot be decoded')
  }
}
