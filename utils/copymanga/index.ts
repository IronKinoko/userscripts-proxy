import crypto from 'crypto-js'

export function parseImageData(imageData: string, jojo: string) {
  const key = imageData.slice(0, 0x10)
  const content = imageData.slice(0x10)

  const wordArray1 = crypto.enc.Utf8.parse(jojo)
  const wordArray2 = crypto.enc.Utf8.parse(key)

  let nextContent = crypto.enc.Base64.stringify(crypto.enc.Hex.parse(content))

  const raw = crypto.AES.decrypt(nextContent, wordArray1, {
    iv: wordArray2,
    mode: crypto.mode.CBC,
    padding: crypto.pad.Pkcs7,
  }).toString(crypto.enc.Utf8)

  return JSON.parse(raw) as { url: string }[]
}
