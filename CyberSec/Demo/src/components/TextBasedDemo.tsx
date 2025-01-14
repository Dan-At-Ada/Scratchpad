import { useState } from 'react'
import { CaesarCipher } from '../utils/caesar-cipher'

export default function TextBasedDemo() {
  const [plaintext, setPlaintext] = useState<string>('')
  const [shift, setShift] = useState<number>(3)
  const [ciphertext, setCiphertext] = useState<string>('')
  const [decrypted, setDecrypted] = useState<string>('')
  const [bruteForceResult, setBruteForceResult] = useState<string>('')
  const [log, setLog] = useState<string[]>([])

  const appendLog = (message: string) => {
    setLog((prevLog) => [...prevLog, message])
  }

  const handleEncrypt = async () => {
    const cipher = new CaesarCipher(shift, appendLog)
    const encrypted = await cipher.encrypt(plaintext)
    setCiphertext(encrypted)
  }

  const handleDecrypt = async () => {
    const cipher = new CaesarCipher(shift, appendLog)
    const decrypted = await cipher.decrypt(ciphertext)
    setDecrypted(decrypted)
  }

  const handleBruteForce = async () => {
    let result = ''
    for (let i = 0; i < 26; i++) {
      const cipher = new CaesarCipher(i, appendLog)
      const decrypted = await cipher.decrypt(ciphertext)
      result += `Shift ${i}: ${decrypted}\n`
    }
    setBruteForceResult(result)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Text-Based Encryption Demo (Caesar Cipher)</h2>
      <div className="mb-4">
        <input
          type="text"
          value={plaintext}
          onChange={(e) => setPlaintext(e.target.value)}
          className="border p-2 mr-2"
          placeholder="Enter plaintext"
        />
        <input
          type="number"
          value={shift}
          onChange={(e) => setShift(Number(e.target.value))}
          className="border p-2 mr-2 w-20"
          placeholder="Shift"
        />
        <button
          onClick={handleEncrypt}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Encrypt
        </button>
        <button
          onClick={handleDecrypt}
          className="bg-green-500 text-white px-4 py-2 rounded mr-2"
        >
          Decrypt
        </button>
        <button
          onClick={handleBruteForce}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Brute Force Attack
        </button>
      </div>
      <div className="mb-2">
        <strong>Ciphertext:</strong> {ciphertext}
      </div>
      <div className="mb-2">
        <strong>Decrypted:</strong> {decrypted}
      </div>
      <div className="mb-2">
        <strong>Brute Force Results:</strong>
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-40">
          {bruteForceResult}
        </pre>
      </div>
      <div>
        <strong>Log:</strong>
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-[50vh]">
          {log.join('\n')}
        </pre>
      </div>
    </div>
  )
}

