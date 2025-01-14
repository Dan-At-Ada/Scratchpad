export class CaesarCipher {
  private shift: number;
  private logger: (message: string) => void;

  constructor(shift: number, logger: (message: string) => void = console.log) {
    this.shift = shift % 26;
    this.logger = logger;
  }

  async encrypt(plaintext: string): Promise<string> {
    const start = performance.now();
    this.logger("Starting Caesar cipher encryption...");
    await new Promise(resolve => setTimeout(resolve, 500)); // 0.5 second delay
    const result = plaintext
      .split('')
      .map(char => this.shiftChar(char, this.shift))
      .join('');
    const end = performance.now();
    this.logger(`Caesar cipher encryption completed in ${(end - start - 500).toFixed(2)}ms`);
    return result;
  }

  async decrypt(ciphertext: string): Promise<string> {
    const start = performance.now();
    this.logger("Starting Caesar cipher decryption...");
    await new Promise(resolve => setTimeout(resolve, 500)); // 0.5 second delay
    const result = ciphertext
      .split('')
      .map(char => this.shiftChar(char, 26 - this.shift))
      .join('');
    const end = performance.now();
    this.logger(`Caesar cipher decryption completed in ${(end - start - 500).toFixed(2)}ms`);
    return result;
  }

  private shiftChar(char: string, shift: number): string {
    if (char.match(/[a-z]/i)) {
      const code = char.charCodeAt(0);
      const isUpperCase = code >= 65 && code <= 90;
      const base = isUpperCase ? 65 : 97;
      return String.fromCharCode((code - base + shift) % 26 + base);
    }
    return char;
  }
}

