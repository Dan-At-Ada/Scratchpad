import { useState } from 'react'
import RSADemo from './components/RSADemo'
import RC4Demo from './components/RC4Demo'
import SHA1Demo from './components/SHA1Demo'
import TLSDemo from './components/TLSDemo'
import TextBasedDemo from './components/TextBasedDemo'
import FullSystemDemo from './components/FullDemo'

export default function App() {
  const [activeDemo, setActiveDemo] = useState<string>('RSA')

  const demos = {
    RSA: <RSADemo />,
    RC4: <RC4Demo />,
    SHA1: <SHA1Demo />,
    TLS: <TLSDemo />,
    TextBased: <TextBasedDemo />,
    FullSystem: <FullSystemDemo />,
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Cryptography Demonstrations</h1>
      <div className="flex space-x-2 mb-4">
        {Object.keys(demos).map((demo) => (
          <button
            key={demo}
            className={`px-4 py-2 rounded ${
              activeDemo === demo ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setActiveDemo(demo)}
          >
            {demo}
          </button>
        ))}
      </div>
      {demos[activeDemo as keyof typeof demos]}
    </div>
  )
}

