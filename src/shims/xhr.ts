export const xhrPost = (url: string, json: string) =>
  new Promise<string>((onResolve, onReject) => {
    const xhr = new globalThis.XMLHttpRequest()
    xhr.onload = () =>
      xhr.status == 200 ? onResolve(xhr.responseText) : onReject(xhr)

    xhr.onerror = onReject
    xhr.onabort = onReject
    xhr.ontimeout = onReject

    xhr.setRequestHeader('content-type', 'application/json')
    xhr.open('POST', url, true)
    xhr.send(json)
  })
