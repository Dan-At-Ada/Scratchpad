export class RC4 {
  private S: number[]
  private i: number
  private j: number
  private logger: (message: string) => void;

  constructor(key: string, logger: (message: string) => void = console.log) {
    this.logger = logger;
    this.S = new Array(256)
    this.i = 0
    this.j = 0

    // Key-scheduling algorithm (KSA)
    for (let i = 0; i < 256; i++) {
      this.S[i] = i
    }

    let j = 0
    for (let i = 0; i < 256; i++) {
      j = (j + this.S[i] + key.charCodeAt(i % key.length)) % 256;
      [this.S[i], this.S[j]] = [this.S[j], this.S[i]]
    }
  }

  private generateKeystreamByte(): number {
    this.i = (this.i + 1) % 256
    this.j = (this.j + this.S[this.i]) % 256;
    [this.S[this.i], this.S[this.j]] = [this.S[this.j], this.S[this.i]]
    return this.S[(this.S[this.i] + this.S[this.j]) % 256]
  }

  async encrypt(plaintext: string): Promise<string> {
    const start = performance.now();
    this.logger("Starting RC4 encryption...");
    await new Promise(resolve => setTimeout(resolve, 1000));
    let ciphertext = '';
    for (let i = 0; i < plaintext.length; i++) {
      const keystreamByte = this.generateKeystreamByte();
      const encryptedByte = plaintext.charCodeAt(i) ^ keystreamByte;
      ciphertext += String.fromCharCode(encryptedByte);
    }
    const result = Buffer.from(ciphertext, 'binary').toString('base64');
    const end = performance.now();
    this.logger(`RC4 encryption completed in ${(end - start - 1000).toFixed(2)}ms`);
    return result;
  }

  async decrypt(ciphertext: string): Promise<string> {
    const start = performance.now();
    this.logger("Starting RC4 decryption...");
    await new Promise(resolve => setTimeout(resolve, 1000));
    let plaintext = '';
    const decodedCiphertext = Buffer.from(ciphertext, 'base64').toString('binary');
    for (let i = 0; i < decodedCiphertext.length; i++) {
      const keystreamByte = this.generateKeystreamByte();
      const decryptedByte = decodedCiphertext.charCodeAt(i) ^ keystreamByte;
      plaintext += String.fromCharCode(decryptedByte);
    }
    const end = performance.now();
    this.logger(`RC4 decryption completed in ${(end - start - 1000).toFixed(2)}ms`);
    return plaintext;
  }
}

