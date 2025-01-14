import { useState } from 'react'
import { RC4 } from '../utils/rc4'

export default function RC4Demo() {
  const [key, setKey] = useState<string>('Key')
  const [plaintext, setPlaintext] = useState<string>('Hello, RC4!')
  const [ciphertext, setCiphertext] = useState<string>('')
  const [decrypted, setDecrypted] = useState<string>('')

  const handleEncrypt = () => {
    const rc4 = new RC4(key)
    const encrypted = rc4.encrypt(plaintext)
    setCiphertext(encrypted)
  }

  const handleDecrypt = () => {
    const rc4 = new RC4(key)
    const decrypted = rc4.decrypt(ciphertext)
    setDecrypted(decrypted)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">RC4 Demonstration</h2>
      <div className="mb-4">
        <input
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="border p-2 mr-2"
          placeholder="Enter key"
        />
        <input
          type="text"
          value={plaintext}
          onChange={(e) => setPlaintext(e.target.value)}
          className="border p-2 mr-2"
          placeholder="Enter plaintext"
        />
        <button
          onClick={handleEncrypt}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Encrypt
        </button>
        <button
          onClick={handleDecrypt}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Decrypt
        </button>
      </div>
      <div className="mb-2">
        <strong>Ciphertext:</strong> {ciphertext}
      </div>
      <div>
        <strong>Decrypted:</strong> {decrypted}
      </div>
    </div>
  )
}

