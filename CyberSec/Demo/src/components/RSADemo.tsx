import { useState } from 'react'
import { SimpleRSA } from '../utils/rsa'

const bigIntToString = (value: bigint | number): string => {
  return typeof value === 'bigint' ? value.toString() : value.toString();
};

export default function RSADemo() {
  const [log, setLog] = useState<string[]>([])
  const [message, setMessage] = useState<string>('12345')

  const appendLog = (message: string) => {
    setLog((prevLog) => [...prevLog, message])
  }

  
  const rsa = new SimpleRSA(appendLog)

  const runDemo = async () => {
    setLog([])
    appendLog("RSA Encryption Demonstration")
    appendLog("============================")

    appendLog("\nStep 1: Generating RSA key pair...")
    const { publicKey, privateKey, p, q } = await rsa.generateKeyPair()
    appendLog(`Public Key (e, n): e=${bigIntToString(publicKey.e)}, n=${bigIntToString(publicKey.n)}`)
    appendLog(`Private Key (d, n): d=${bigIntToString(privateKey.d)}, n=${bigIntToString(privateKey.n)}`)
    appendLog(`Prime p: ${bigIntToString(p)}`)
    appendLog(`Prime q: ${bigIntToString(q)}`)

    appendLog("\nStep 2: Encrypting the message")
    appendLog(`Original Message: ${message}`)
    const encrypted = await rsa.encrypt(BigInt(message), publicKey)
    appendLog(`Encrypted Message: ${bigIntToString(encrypted)}`)

    appendLog("\nStep 3: Decrypting the message")
    const decrypted = await rsa.decrypt(encrypted, privateKey)
    appendLog(`Decrypted Message: ${bigIntToString(decrypted)}`)

    appendLog("\nStep 4: Simulating a factorization attack")
    appendLog(`Attempting to factor n = ${bigIntToString(publicKey.n)}`)
    const factors = await rsa.factorizationAttack(publicKey.n)
    const [factorP, factorQ] = factors || [null, null]

    if (factorP && factorQ) {
      appendLog("Factorization attack successful!")
      appendLog(`Recovered p: ${bigIntToString(factorP)}`)
      appendLog(`Recovered q: ${bigIntToString(factorQ)}`)

      appendLog("\nStep 5: Reconstructing the private key")
      const phi = (factorP - BigInt(1)) * (factorQ - BigInt(1))
      const crackedD = rsa.modInverse(publicKey.e, phi)
      const crackedPrivateKey = { d: crackedD, n: publicKey.n }
      appendLog(`Reconstructed Private Key: d=${bigIntToString(crackedPrivateKey.d)}, n=${bigIntToString(crackedPrivateKey.n)}`)

      appendLog("\nStep 6: Decrypting the message using the cracked key")
      const crackedDecrypted = await rsa.decrypt(encrypted, crackedPrivateKey)
      appendLog(`Decrypted Message using cracked key: ${bigIntToString(crackedDecrypted)}`)

      if (crackedDecrypted === BigInt(message)) {
        appendLog("\nDemonstration of successful attack: Original message recovered!")
      } else {
        appendLog("\nAttack failed: Original message not recovered.")
      }
    } else {
      appendLog("Factorization attack failed. In real RSA with large primes, this is computationally infeasible.")
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">RSA Demonstration</h2>
      <div className="mb-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border p-2 mr-2"
          placeholder="Enter a number"
        />
        <button
          onClick={runDemo}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Run Demo
        </button>
      </div>
      <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
        {log.join('\n')}
      </pre>
    </div>
  )
}

