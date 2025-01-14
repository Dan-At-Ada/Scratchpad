import { useState } from 'react'
import { TLS } from '../utils/tls'

export default function TLSDemo() {
  const [log, setLog] = useState<string[]>([])

  const appendLog = (message: string) => {
    setLog((prevLog) => [...prevLog, message])
  }

  const runDemo = () => {
    setLog([])
    const tls = new TLS()
    tls.handshake(appendLog)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">TLS 1.0 Demonstration</h2>
      <button
        onClick={runDemo}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Run TLS Handshake Demo
      </button>
      <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-[50vh]">
        {log.join('\n')}
      </pre>
    </div>
  )
}

