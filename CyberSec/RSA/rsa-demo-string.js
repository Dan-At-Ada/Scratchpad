import { performance } from 'perf_hooks';
import { modPow, modInverse, gcd } from './bigint-helpers.js';

class SimpleRSA {
  constructor() {
    // List of prime numbers to choose from for this demonstration
    // In real-world scenarios, much larger primes would be used (2048 bits or more)
    this.primes = [
      10007, 10009, 10037, 10039, 10061, 10067, 10069, 10079, 10091, 10093, 
      10099, 10103, 10111, 10133, 10139, 10141, 10151, 10159, 10163, 10169, 
      10177, 10181, 10193, 10211, 10223, 10243, 10247, 10253, 10259, 10267
    ];
  }

  // Select a random prime from the list
  getRandomPrime() {
    // Generate a random index to select a prime from the list
    const randomIndex = Math.floor(Math.random() * this.primes.length);
    const selectedPrime = this.primes[randomIndex];
    console.log(`Selected prime: ${selectedPrime}`);
    return selectedPrime;
  }

  // Choose a suitable public exponent e
  chooseE(phi) {
    console.log(`Choosing public exponent e for φ(n) = ${phi}`);
    // Start with 65537, a prime number commonly used as the public exponent
    let e = BigInt(65537);
    while (e < phi) {
      // Check if e and phi are coprime (their greatest common divisor is 1)
      if (gcd(e, phi) === BigInt(1)) {
        console.log(`Chosen public exponent e: ${e}`);
        return e;
      }
      // If not coprime, try the next odd number
      e += BigInt(2);
    }
    throw new Error("Unable to find suitable e");
  }

  // Generate a key pair (public and private keys)
  async generateKeyPair() {
    console.log("Starting key pair generation...");
    const startTime = performance.now();

    // Step 1: Choose two distinct prime numbers
    const p = this.getRandomPrime();
    const q = this.getRandomPrime();
    console.log(`Chosen primes: p = ${p}, q = ${q}`);

    // Step 2: Compute n = p * q
    // n is the modulus for both the public and private keys
    const n = BigInt(p) * BigInt(q);
    console.log(`Computed n = p * q = ${n}`);

    // Step 3: Compute φ(n) = (p-1) * (q-1)
    // φ(n) is Euler's totient function
    const phi = BigInt(p - 1) * BigInt(q - 1);
    console.log(`Computed φ(n) = (p-1) * (q-1) = ${phi}`);

    // Step 4: Choose an integer e such that 1 < e < φ(n) and gcd(e, φ(n)) = 1
    const e = this.chooseE(phi);

    // Step 5: Compute d to satisfy the congruence relation d * e ≡ 1 (mod φ(n))
    // d is the modular multiplicative inverse of e modulo φ(n)
    const d = modInverse(e, phi);
    console.log(`Computed private exponent d: ${d}`);

    const endTime = performance.now();
    console.log(`Key generation took ${(endTime - startTime).toFixed(3)} ms`);

    // Return the public key (e, n) and private key (d, n)
    return {
      publicKey: { e, n },
      privateKey: { d, n },
      p,
      q
    };
  }

  // Convert a string to a BigInt
  stringToBigInt(str) {
    return BigInt('0x' + Buffer.from(str, 'utf8').toString('hex'));
  }

  // Convert a BigInt to a string
  bigIntToString(bigInt) {
    return Buffer.from(bigInt.toString(16), 'hex').toString('utf8');
  }

  // Encrypt a message using the public key
  async encrypt(message, publicKey) {
    console.log(`\nEncrypting message: ${message}`);
    const startTime = performance.now();
    const { e, n } = publicKey;
    console.log(`Using public key: e = ${e}, n = ${n}`);

    // Convert the message to a BigInt
    const messageBigInt = this.stringToBigInt(message);

    // Encryption formula: c ≡ m^e mod n
    // where c is the ciphertext, m is the message
    const encrypted = modPow(messageBigInt, e, n);
    
    const endTime = performance.now();
    console.log(`Encryption took ${(endTime - startTime).toFixed(3)} ms`);
    console.log(`Encrypted message: ${encrypted}`);

    return encrypted;
  }

  // Decrypt a message using the private key
  async decrypt(ciphertext, privateKey) {
    console.log(`\nDecrypting ciphertext: ${ciphertext}`);
    const startTime = performance.now();
    const { d, n } = privateKey;
    console.log(`Using private key: d = ${d}, n = ${n}`);

    // Decryption formula: m ≡ c^d mod n
    // where m is the original message, c is the ciphertext
    const decryptedBigInt = modPow(ciphertext, d, n);
    
    const endTime = performance.now();
    console.log(`Decryption took ${(endTime - startTime).toFixed(3)} ms`);
    console.log(`Decrypted message: ${decryptedBigInt}`);

    // Convert the decrypted BigInt back to a string
    const decryptedMessage = this.bigIntToString(decryptedBigInt);

    return decryptedMessage;
  }

  // Simulate a factorization attack to find p and q given n
  async factorizationAttack(n) {
    console.log(`\nStarting factorization attack on n = ${n}`);
    const startTime = performance.now();
    let attempts = 0;
    n = BigInt(n);

    // Calculate the square root of n as an upper bound for the search
    const sqrtN = BigInt(Math.floor(Math.sqrt(Number(n))));
    console.log(`Square root of n: ${sqrtN}`);

    // Try dividing n by every number from 2 to sqrt(n)
    for (let i = BigInt(2); i <= sqrtN; i += BigInt(1)) {
      attempts++;
      // Log progress every 1000 attempts
      if (attempts % 1000 === 0) {
        console.log(`Factorization progress: Tested ${attempts} numbers...`);
      }
      // If i divides n evenly, we've found a factor
      if (n % i === BigInt(0)) {
        const endTime = performance.now();
        console.log(`Factorization attack succeeded!`);
        console.log(`Factorization attack took ${(endTime - startTime).toFixed(3)} ms`);
        console.log(`Number of attempts: ${attempts}`);
        // Return the found factors: i and n/i
        return [i, n / i];
      }
    }

    // If no factors are found, the attack has failed
    const endTime = performance.now();
    console.log(`Factorization attack failed!`);
    console.log(`Factorization attack took ${(endTime - startTime).toFixed(3)} ms`);
    console.log(`Number of attempts: ${attempts}`);
    return null;
  }
}

// Function to introduce a delay between steps
async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main demonstration function
async function runDemo() {
  console.log("RSA Encryption Demonstration with Larger Primes and Detailed Logging");
  console.log("==================================================================");

  const rsa = new SimpleRSA();

  console.log("\nStep 1: Generating key pair...");
  const { publicKey, privateKey, p, q } = await rsa.generateKeyPair();
  console.log("Generated Key Pair:");
  console.log("Public Key (e, n):", publicKey);
  console.log("Private Key (d, n):", privateKey);
  console.log("Prime p:", p);
  console.log("Prime q:", q);

  await delay(2000);

  console.log("\nStep 2: Encrypting a message");
  const message = "Hello, RSA!";
  console.log("Original Message:", message);

  const encrypted = await rsa.encrypt(message, publicKey);
  console.log("Final Encrypted Message:", encrypted);

  await delay(2000);

  console.log("\nStep 3: Decrypting the message");
  const decrypted = await rsa.decrypt(encrypted, privateKey);
  console.log("Final Decrypted Message:", decrypted);

  await delay(2000);

  console.log("\nStep 4: Simulating a factorization attack");
  console.log("This attack is possible due to the relatively small primes used in this demonstration");
  console.log("Attempting to factor n =", publicKey.n);
  const [factorP, factorQ] = await rsa.factorizationAttack(publicKey.n);

  if (factorP && factorQ) {
    console.log("Factorization attack successful!");
    console.log("Recovered p:", factorP);
    console.log("Recovered q:", factorQ);

    await delay(2000);

    console.log("\nStep 5: Reconstructing the private key");
    const reconstructStartTime = performance.now();
    // Recalculate φ(n) using the recovered factors
    const phi = (factorP - BigInt(1)) * (factorQ - BigInt(1));
    console.log(`Reconstructed φ(n) = (p-1) * (q-1) = ${phi}`);
    // Calculate the private exponent d using the public exponent e and φ(n)
    const crackedD = modInverse(publicKey.e, phi);
    const crackedPrivateKey = { d: crackedD, n: publicKey.n };
    const reconstructEndTime = performance.now();
    
    console.log("Reconstructed Private Key:", crackedPrivateKey);
    console.log(`Private key reconstruction took ${(reconstructEndTime - reconstructStartTime).toFixed(3)} ms`);

    await delay(2000);

    console.log("\nStep 6: Decrypting the message using the cracked key");
    const crackedDecrypted = await rsa.decrypt(encrypted, crackedPrivateKey);
    console.log("Decrypted Message using cracked key:", crackedDecrypted);

    if (crackedDecrypted === message) {
      console.log("\nDemonstration of successful attack: Original message recovered!");
    } else {
      console.log("\nAttack failed: Original message not recovered.");
    }
  } else {
    console.log("Factorization attack failed. In real RSA with large primes, this is computationally infeasible.");
  }

  console.log("\nImportant Note: While this demonstration uses larger primes, it is still not secure for real-world use.");
  console.log("Production RSA implementations use much larger prime numbers (2048 bits or more) and additional security measures.");
}

// Run the demonstration
runDemo();