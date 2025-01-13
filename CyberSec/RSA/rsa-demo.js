import { performance } from 'perf_hooks'; // Import performance hooks for measuring execution time
import { modPow, modInverse, gcd } from './bigint-helpers.js'; // Import helper functions for modular arithmetic

// SimpleRSA class to demonstrate RSA encryption and decryption
class SimpleRSA {
  constructor() {
    // List of prime numbers to choose from for RSA key generation
    this.primes = [
      10007, 10009, 10037, 10039, 10061, 10067, 10069, 10079, 10091, 10093, 
      10099, 10103, 10111, 10133, 10139, 10141, 10151, 10159, 10163, 10169, 
      10177, 10181, 10193, 10211, 10223, 10243, 10247, 10253, 10259, 10267
    ];
  }

  // Function to randomly select a prime number from the list
  getRandomPrime() {
    const randomIndex = Math.floor(Math.random() * this.primes.length); // Randomly select an index
    const selectedPrime = this.primes[randomIndex]; // Get the prime number at the selected index
    console.log(`Selected prime number: ${selectedPrime}`);
    return selectedPrime;
  }

  // Function to choose a public exponent 'e' that is coprime with φ(n)
  chooseE(phi) {
    console.log(`Choosing a public exponent 'e' such that it is coprime with φ(n) = ${phi}`);
    let e = BigInt(65537); // Commonly used value for 'e' in RSA
    while (e < phi) {
      if (gcd(e, phi) === BigInt(1)) { // Check if 'e' is coprime with φ(n)
        console.log(`Chosen public exponent 'e': ${e}`);
        return e;
      }
      e += BigInt(2); // Increment 'e' by 2 to keep it odd
    }
    throw new Error("Unable to find a suitable public exponent 'e'");
  }

  // Function to generate RSA key pair (public and private keys)
  async generateKeyPair() {
    console.log("Starting the process of generating RSA key pair...");
    const startTime = performance.now(); // Start timing the key generation process

    // Select two random prime numbers
    const p = this.getRandomPrime();
    const q = this.getRandomPrime();
    console.log(`Chosen prime numbers: p = ${p}, q = ${q}`);

    // Calculate n (modulus) as the product of p and q
    const n = BigInt(p) * BigInt(q);
    console.log(`Computed n (modulus) = p * q = ${n}`);

    // Calculate φ(n) (Euler's totient) as (p-1) * (q-1)
    const phi = BigInt(p - 1) * BigInt(q - 1);
    console.log(`Computed φ(n) (Euler's totient) = (p-1) * (q-1) = ${phi}`);

    // Choose a public exponent 'e'
    const e = this.chooseE(phi);

    // Calculate the private exponent 'd' as the modular inverse of 'e' modulo φ(n)
    const d = modInverse(e, phi);
    console.log(`Computed private exponent 'd': ${d}`);

    const endTime = performance.now(); // End timing the key generation process
    console.log(`Key generation completed in ${(endTime - startTime).toFixed(3)} milliseconds`);

    // Return the generated key pair along with the prime numbers used
    return {
      publicKey: { e, n },
      privateKey: { d, n },
      p,
      q
    };
  }

  // Function to encrypt a message using the public key
  async encrypt(message, publicKey) {
    console.log(`\nEncrypting the message: ${message}`);
    const startTime = performance.now(); // Start timing the encryption process
    const { e, n } = publicKey;
    console.log(`Using public key: e = ${e}, n = ${n}`);

    // Encrypt the message using modular exponentiation
    const encrypted = modPow(BigInt(message), e, n);
    
    const endTime = performance.now(); // End timing the encryption process
    console.log(`Encryption completed in ${(endTime - startTime).toFixed(3)} milliseconds`);
    console.log(`Encrypted message (ciphertext): ${encrypted}`);

    return encrypted;
  }

  // Function to decrypt a ciphertext using the private key
  async decrypt(ciphertext, privateKey) {
    console.log(`\nDecrypting the ciphertext: ${ciphertext}`);
    const startTime = performance.now(); // Start timing the decryption process
    const { d, n } = privateKey;
    console.log(`Using private key: d = ${d}, n = ${n}`);

    // Decrypt the ciphertext using modular exponentiation
    const decrypted = modPow(ciphertext, d, n);
    
    const endTime = performance.now(); // End timing the decryption process
    console.log(`Decryption completed in ${(endTime - startTime).toFixed(3)} milliseconds`);
    console.log(`Decrypted message: ${decrypted}`);

    return decrypted;
  }

  // Function to simulate a factorization attack on n
  async factorizationAttack(n) {
    console.log(`\nStarting factorization attack on n = ${n}`);
    const startTime = performance.now(); // Start timing the factorization attack
    let attempts = 0;
    n = BigInt(n);

    // Calculate the square root of n
    const sqrtN = BigInt(Math.floor(Math.sqrt(Number(n))));
    console.log(`Square root of n: ${sqrtN}`);

    let delayTime = 0;
    // Try to find factors of n by testing each number up to the square root of n
    for (let i = BigInt(2); i <= sqrtN; i += BigInt(1)) {
      attempts++;
      if (attempts % 1000 === 0) {
        console.log(`Factorization progress: Tested ${attempts} numbers...`);
        const delayStart = performance.now();
        await delay(100); // Introduce a delay to simulate time taken for factorization
        delayTime += performance.now() - delayStart;
      }
      if (n % i === BigInt(0)) { // Check if i is a factor of n
        const endTime = performance.now(); // End timing the factorization attack
        console.log(`Factorization attack succeeded!`);
        console.log(`Factorization completed in ${(endTime - startTime - delayTime).toFixed(3)} milliseconds with a delay of ${delayTime.toFixed(3)} milliseconds`);
        console.log(`Number of attempts: ${attempts}`);
        return [i, n / i]; // Return the factors of n
      }
    }

    const endTime = performance.now(); // End timing the factorization attack
    console.log(`Factorization attack failed!`);
    console.log(`Factorization completed in ${(endTime - startTime - delayTime).toFixed(3)} milliseconds with a delay of ${delayTime.toFixed(3)} milliseconds`);
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

  console.log("\nStep 1: Generating RSA key pair...");
  const { publicKey, privateKey, p, q } = await rsa.generateKeyPair();
  console.log("Generated Key Pair:");
  console.log("Public Key (e, n):", publicKey);
  console.log("Private Key (d, n):", privateKey);
  console.log("Prime number p:", p);
  console.log("Prime number q:", q);

  await delay(3000); // Increased delay

  console.log("\nStep 2: Encrypting a message");
  const message = 12345;
  console.log("Original Message:", message);

  const encrypted = await rsa.encrypt(message, publicKey);
  console.log("Final Encrypted Message (ciphertext):", encrypted);

  await delay(3000); // Increased delay

  console.log("\nStep 3: Decrypting the message");
  const decrypted = await rsa.decrypt(encrypted, privateKey);
  console.log("Final Decrypted Message:", decrypted);
  console.log(String(decrypted));

  await delay(3000); // Increased delay

  console.log("\nStep 4: Simulating a factorization attack");
  console.log("This attack is possible due to the relatively small primes used in this demonstration");
  console.log("Attempting to factor n =", publicKey.n);
  const [factorP, factorQ] = await rsa.factorizationAttack(publicKey.n);

  if (factorP && factorQ) {
    console.log("Factorization attack successful!");
    console.log("Recovered prime number p:", factorP);
    console.log("Recovered prime number q:", factorQ);

    await delay(3000); // Increased delay

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
    console.log(`Private key reconstruction completed in ${(reconstructEndTime - reconstructStartTime).toFixed(3)} milliseconds`);

    await delay(3000); // Increased delay

    console.log("\nStep 6: Decrypting the message using the cracked key");
    const crackedDecrypted = await rsa.decrypt(encrypted, crackedPrivateKey);
    console.log("Decrypted Message using cracked key:", crackedDecrypted);

    if (crackedDecrypted === BigInt(message)) {
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