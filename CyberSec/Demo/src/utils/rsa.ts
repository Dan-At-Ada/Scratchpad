import { modPow, modInverse, gcd } from './bigint-helpers'

export class SimpleRSA {
  primes: number[]
  private logger: (message: string) => void

  constructor(logger: (message: string) => void = console.log) {
    this.logger = logger
    this.primes = [
      10007, 10009, 10037, 10039, 10061, 10067, 10069, 10079, 10091, 10093, 
      10099, 10103, 10111, 10133, 10139, 10141, 10151, 10159, 10163, 10169, 
      10177, 10181, 10193, 10211, 10223, 10243, 10247, 10253, 10259, 10267
    ]
  }

  getRandomPrime(): number {
    return this.primes[Math.floor(Math.random() * this.primes.length)]
  }

  chooseE(phi: bigint): bigint {
    let e = BigInt(65537)
    while (e < phi) {
      if (gcd(e, phi) === BigInt(1)) {
        return e
      }
      e += BigInt(2)
    }
    throw new Error("Unable to find suitable e")
  }

  async generateKeyPair() {
    const start = performance.now()
    this.logger("Starting RSA key pair generation...")
    await new Promise(resolve => setTimeout(resolve, 1000)) // 1 second delay

    const p = BigInt(this.getRandomPrime())
    const q = BigInt(this.getRandomPrime())
    const n = p * q
    const phi = (p - BigInt(1)) * (q - BigInt(1))
    const e = this.chooseE(phi)
    const d = modInverse(e, phi)

    const end = performance.now()
    this.logger(`RSA key pair generation completed in ${(end - start - 1000).toFixed(2)}ms`)

    return {
      publicKey: { e, n },
      privateKey: { d, n },
      p,
      q
    }
  }

  async encrypt(message: bigint, publicKey: { e: bigint, n: bigint }): Promise<bigint> {
    const start = performance.now()
    this.logger("Starting RSA encryption...")
    await new Promise(resolve => setTimeout(resolve, 500)) // 0.5 second delay

    const { e, n } = publicKey
    const result = modPow(message, e, n)

    const end = performance.now()
    this.logger(`RSA encryption completed in ${(end - start - 500).toFixed(2)}ms`)

    return result
  }

  async decrypt(ciphertext: bigint, privateKey: { d: bigint, n: bigint }): Promise<bigint> {
    const start = performance.now()
    this.logger("Starting RSA decryption...")
    await new Promise(resolve => setTimeout(resolve, 500)) // 0.5 second delay

    const { d, n } = privateKey
    const result = modPow(ciphertext, d, n)

    const end = performance.now()
    this.logger(`RSA decryption completed in ${(end - start - 500).toFixed(2)}ms`)

    return result
  }

  async factorizationAttack(n: bigint): Promise<[bigint, bigint] | null> {
    const start = performance.now()
    this.logger("Starting factorization attack...")
    await new Promise(resolve => setTimeout(resolve, 2000)) // 2 seconds delay

    const sqrtN = BigInt(Math.floor(Math.sqrt(Number(n))))
    for (let i = BigInt(2); i <= sqrtN; i += BigInt(1)) {
      if (n % i === BigInt(0)) {
        const end = performance.now()
        this.logger(`Factorization attack completed in ${(end - start - 2000).toFixed(2)}ms`)
        return [i, n / i]
      }
    }

    const end = performance.now()
    this.logger(`Factorization attack failed in ${(end - start - 2000).toFixed(2)}ms`)
    return null
  }

  modInverse(a: bigint, m: bigint): bigint {
    return modInverse(a, m)
  }
}

