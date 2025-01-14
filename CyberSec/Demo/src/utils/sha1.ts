export class SHA1 {
  private logger: (message: string) => void;

  constructor(logger: (message: string) => void = console.log) {
    this.logger = logger;
  }

  private static readonly K: number[] = [
    0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6
  ]

  private static rotl(n: number, s: number): number {
    return (n << s) | (n >>> (32 - s))
  }

  async hash(message: string): Promise<string> {
    const start = performance.now();
    this.logger("Starting SHA1 hashing...");
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay

    let h0 = 0x67452301
    let h1 = 0xefcdab89
    let h2 = 0x98badcfe
    let h3 = 0x10325476
    let h4 = 0xc3d2e1f0

    const utf8Encode = new TextEncoder()
    const messageUint8 = utf8Encode.encode(message)
    const messageLenBits = messageUint8.length * 8
    const paddedLength = Math.ceil((messageLenBits + 65) / 512) * 512
    const paddedMessage = new Uint8Array(paddedLength / 8)

    paddedMessage.set(messageUint8)
    paddedMessage[messageUint8.length] = 0x80

    const messageLenBitsArray = new Uint8Array(8)
    const dataView = new DataView(messageLenBitsArray.buffer)
    dataView.setBigUint64(0, BigInt(messageLenBits), false)
    paddedMessage.set(messageLenBitsArray, paddedMessage.length - 8)

    for (let i = 0; i < paddedMessage.length; i += 64) {
      const chunk = paddedMessage.slice(i, i + 64)
      const w = new Uint32Array(80)

      for (let j = 0; j < 16; j++) {
        w[j] = (chunk[j * 4] << 24) | (chunk[j * 4 + 1] << 16) | (chunk[j * 4 + 2] << 8) | chunk[j * 4 + 3]
      }

      for (let j = 16; j < 80; j++) {
        w[j] = SHA1.rotl(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1)
      }

      let a = h0
      let b = h1
      let c = h2
      let d = h3
      let e = h4

      for (let j = 0; j < 80; j++) {
        let f: number
        let k: number

        if (j < 20) {
          f = (b & c) | ((~b) & d)
          k = SHA1.K[0]
        } else if (j < 40) {
          f = b ^ c ^ d
          k = SHA1.K[1]
        } else if (j < 60) {
          f = (b & c) | (b & d) | (c & d)
          k = SHA1.K[2]
        } else {
          f = b ^ c ^ d
          k = SHA1.K[3]
        }

        const temp = (SHA1.rotl(a, 5) + f + e + k + w[j]) | 0
        e = d
        d = c
        c = SHA1.rotl(b, 30)
        b = a
        a = temp
      }

      h0 = (h0 + a) | 0
      h1 = (h1 + b) | 0
      h2 = (h2 + c) | 0
      h3 = (h3 + d) | 0
      h4 = (h4 + e) | 0
    }

    const result = [h0, h1, h2, h3, h4]
      .map(h => (h >>> 0).toString(16).padStart(8, '0'))
      .join('');

    const end = performance.now();
    this.logger(`SHA1 hashing completed in ${(end - start - 1000).toFixed(2)}ms`);
    return result;
  }
}

