import { useState } from 'react'
import { SHA1 } from '../utils/sha1'

export default function SHA1Demo() {
  const [input, setInput] = useState<string>('')
  const [hash, setHash] = useState<string>('')
  const [log, setLog] = useState<string[]>([])

  const appendLog = (message: string) => {
    setLog((prevLog) => [...prevLog, message])
  }

  const handleHash = async () => {
    const sha1 = new SHA1(appendLog)
    const hashedValue = await sha1.hash(input)
    setHash(hashedValue)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">SHA1 Demonstration</h2>
      <div className="mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-2 mr-2"
          placeholder="Enter text to hash"
        />
        <button
          onClick={handleHash}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Hash
        </button>
      </div>
      <div className="mb-2">
        <strong>SHA1 Hash:</strong> {hash}
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

