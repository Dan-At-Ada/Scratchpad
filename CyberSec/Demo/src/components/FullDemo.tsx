import React, { useState } from 'react';
import { SimpleRSA } from '../utils/rsa';
import { RC4 } from '../utils/rc4';
import { SHA1 } from '../utils/sha1';
import { CaesarCipher } from '../utils/caesar-cipher';

export default function FullSystemDemo() {
  const [message, setMessage] = useState<string>('Hello, Cryptography!');
  const [log, setLog] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const appendLog = (message: string) => {
    setLog((prevLog) => [...prevLog, message]);
  };

  const clearLog = () => {
    setLog([]);
  };

  const hashToBigInt = (hash: string): bigint => {
    return BigInt(`0x${hash}`);
  };

  const simulateFullSystem = async () => {
    setIsRunning(true);
    clearLog();
    
    const rsa = new SimpleRSA(appendLog);
    const rc4 = new RC4('secret_key', appendLog);
    const sha1 = new SHA1(appendLog);
    const caesar = new CaesarCipher(3, appendLog);

    appendLog('Starting full system simulation...');
    appendLog('Step 1: Generate RSA key pair');
    const { publicKey, privateKey } = await rsa.generateKeyPair();

    appendLog('Step 2: Encrypt the message with RC4');
    const rc4Encrypted = await rc4.encrypt(message);

    appendLog('Step 3: Create a digital signature');
    const messageHash = await sha1.hash(message);
    const hashBigInt = hashToBigInt(messageHash);
    appendLog(`Message hash: ${messageHash}`);
    appendLog(`Hash as BigInt: ${hashBigInt}`);
    const signature = await rsa.encrypt(hashBigInt, publicKey);

    appendLog('Step 4: Apply Caesar cipher to the RC4 encrypted message');
    const caesarEncrypted = await caesar.encrypt(rc4Encrypted);

    appendLog('Step 5: Simulate secure transmission');
    await new Promise(resolve => setTimeout(resolve, 1000));
    appendLog('Message transmitted securely...');

    appendLog('Step 6: Decrypt Caesar cipher');
    const caesarDecrypted = await caesar.decrypt(caesarEncrypted);

    appendLog('Step 7: Decrypt RC4');
    const rc4Decrypted = await rc4.decrypt(caesarDecrypted);

    appendLog('Step 8: Verify digital signature');
    const decryptedSignature = await rsa.decrypt(signature, privateKey);
    const receivedMessageHash = await sha1.hash(rc4Decrypted);
    const receivedHashBigInt = hashToBigInt(receivedMessageHash);
    
    appendLog(`Decrypted signature: ${decryptedSignature}`);
    appendLog(`Received message hash: ${receivedMessageHash}`);
    appendLog(`Received hash as BigInt: ${receivedHashBigInt}`);

    if (receivedHashBigInt === decryptedSignature) {
      appendLog('Signature verified successfully!');
    } else {
      appendLog('Signature verification failed!');
    }

    appendLog('Full system simulation completed.');
    appendLog(`Original message: ${message}`);
    appendLog(`Received message: ${rc4Decrypted}`);
    setIsRunning(false);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Full Cryptographic System Simulation</h2>
      <div className="mb-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border p-2 mr-2 w-full"
          placeholder="Enter message"
        />
      </div>
      <button
        onClick={simulateFullSystem}
        disabled={isRunning}
        className="bg-blue-500 text-white px-4 py-2 rounded mr-2 disabled:opacity-50"
      >
        {isRunning ? 'Simulating...' : 'Run Simulation'}
      </button>
      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2">Simulation Log:</h3>
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-sm">
          {log.join('\n')}
        </pre>
      </div>
    </div>
  );
}

