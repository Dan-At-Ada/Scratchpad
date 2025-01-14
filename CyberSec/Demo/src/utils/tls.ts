export class TLS {
  private clientRandom: string
  private serverRandom: string
  private premaster: string

  constructor() {
    this.clientRandom = this.generateRandom()
    this.serverRandom = this.generateRandom()
    this.premaster = this.generateRandom()
  }

  private generateRandom(): string {
    return Math.random().toString(36).substring(2, 15)
  }

  handshake(log: (message: string) => void): void {
    log("Starting TLS 1.0 Handshake")

    // Client Hello
    log("Client Hello:")
    log(`  Client Random: ${this.clientRandom}`)
    log("  Supported Cipher Suites: TLS_RSA_WITH_AES_128_CBC_SHA")

    // Server Hello
    log("\nServer Hello:")
    log(`  Server Random: ${this.serverRandom}`)
    log("  Selected Cipher Suite: TLS_RSA_WITH_AES_128_CBC_SHA")

    // Server Certificate
    log("\nServer sends Certificate")

    // Server Hello Done
    log("Server Hello Done")

    // Client Key Exchange
    log("\nClient Key Exchange:")
    log(`  Premaster Secret: ${this.premaster}`)
    log("  (Encrypted with server's public key)")

    // Change Cipher Spec
    log("\nClient sends Change Cipher Spec")
    log("Server sends Change Cipher Spec")

    // Finished
    log("\nClient sends Finished message")
    log("Server sends Finished message")

    log("\nTLS Handshake completed")
  }
}

