import { useState } from 'react'
import './EncryptionCard.css'

const API_URL = 'http://localhost:3000'

function EncryptionCard({ algorithm }) {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const [iv, setIv] = useState('')
  const [privateKey, setPrivateKey] = useState('')
  const [publicKey, setPublicKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState('encrypt')

  const handleEncrypt = async () => {
    if (!inputText) return

    setLoading(true)
    try {
      let response
      
      if (algorithm === 'aes') {
        if (!secretKey) {
          alert('Please enter a secret key')
          setLoading(false)
          return
        }
        response = await fetch(`${API_URL}/crypto/encrypt/aes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: inputText, secretKey })
        })
        const data = await response.json()
        setOutputText(data.encrypted)
        setIv(data.iv)
      } else if (algorithm === 'rsa') {
        response = await fetch(`${API_URL}/crypto/encrypt/rsa`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: inputText })
        })
        const data = await response.json()
        setOutputText(data.encrypted)
        setPrivateKey(data.privateKey)
        setPublicKey(data.publicKey)
      } else if (algorithm === 'sha256') {
        response = await fetch(`${API_URL}/crypto/hash/sha256`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: inputText })
        })
        const data = await response.json()
        setOutputText(data.hash)
      }
    } catch (error) {
      alert('Error: ' + error.message)
    }
    setLoading(false)
  }

  const handleDecrypt = async () => {
    if (!outputText) return

    setLoading(true)
    try {
      let response
      
      if (algorithm === 'aes') {
        if (!secretKey || !iv) {
          alert('Please provide secret key and IV')
          setLoading(false)
          return
        }
        response = await fetch(`${API_URL}/crypto/decrypt/aes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ encrypted: outputText, secretKey, iv })
        })
        const data = await response.json()
        if (data.error) {
          alert(data.error)
        } else {
          setInputText(data.decrypted)
        }
      } else if (algorithm === 'rsa') {
        if (!privateKey) {
          alert('Please provide private key')
          setLoading(false)
          return
        }
        response = await fetch(`${API_URL}/crypto/decrypt/rsa`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ encrypted: outputText, privateKey })
        })
        const data = await response.json()
        if (data.error) {
          alert(data.error)
        } else {
          setInputText(data.decrypted)
        }
      }
    } catch (error) {
      alert('Error: ' + error.message)
    }
    setLoading(false)
  }

  const handleClear = () => {
    setInputText('')
    setOutputText('')
    setSecretKey('')
    setIv('')
    setPrivateKey('')
    setPublicKey('')
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  return (
    <div className="encryption-card">
      <div className="card-header">
        <h2 className="card-title">
          {algorithm === 'aes' && '🔐 AES-256 Encryption'}
          {algorithm === 'rsa' && '🔑 RSA-2048 Encryption'}
          {algorithm === 'sha256' && '🔒 SHA-256 Hashing'}
        </h2>
      </div>

      <div className="card-body">
        {/* Input Section */}
        <div className="input-section">
          <label className="label">Input Text</label>
          <textarea
            className="textarea"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text to encrypt/hash..."
            rows={4}
          />
        </div>

        {/* Secret Key for AES */}
        {algorithm === 'aes' && (
          <div className="input-section">
            <label className="label">Secret Key</label>
            <input
              type="text"
              className="input"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="Enter your secret key"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="button-group">
          <button 
            className="btn btn-primary" 
            onClick={handleEncrypt}
            disabled={loading}
          >
            {loading ? '⏳ Processing...' : algorithm === 'sha256' ? '🔒 Hash' : '🔐 Encrypt'}
          </button>
          
          {algorithm !== 'sha256' && (
            <button 
              className="btn btn-secondary" 
              onClick={handleDecrypt}
              disabled={loading}
            >
              {loading ? '⏳ Processing...' : '🔓 Decrypt'}
            </button>
          )}
          
          <button className="btn btn-danger" onClick={handleClear}>
            🗑️ Clear
          </button>
        </div>

        {/* Output Section */}
        {outputText && (
          <div className="output-section">
            <div className="output-header">
              <label className="label">
                {algorithm === 'sha256' ? 'Hash Output' : 'Encrypted Output'}
              </label>
              <button 
                className="copy-btn" 
                onClick={() => copyToClipboard(outputText)}
              >
                📋 Copy
              </button>
            </div>
            <textarea
              className="textarea output-textarea"
              value={outputText}
              readOnly
              rows={4}
            />
          </div>
        )}

        {/* IV for AES */}
        {algorithm === 'aes' && iv && (
          <div className="output-section">
            <div className="output-header">
              <label className="label">Initialization Vector (IV)</label>
              <button className="copy-btn" onClick={() => copyToClipboard(iv)}>
                📋 Copy
              </button>
            </div>
            <input
              type="text"
              className="input"
              value={iv}
              onChange={(e) => setIv(e.target.value)}
              readOnly={mode === 'encrypt'}
            />
            <p className="hint">💡 Save this IV - you'll need it for decryption!</p>
          </div>
        )}

        {/* RSA Keys */}
        {algorithm === 'rsa' && (publicKey || privateKey) && (
          <>
            {publicKey && (
              <div className="output-section">
                <div className="output-header">
                  <label className="label">Public Key</label>
                  <button className="copy-btn" onClick={() => copyToClipboard(publicKey)}>
                    📋 Copy
                  </button>
                </div>
                <textarea
                  className="textarea key-textarea"
                  value={publicKey}
                  readOnly
                  rows={6}
                />
              </div>
            )}
            
            {privateKey && (
              <div className="output-section">
                <div className="output-header">
                  <label className="label">Private Key</label>
                  <button className="copy-btn" onClick={() => copyToClipboard(privateKey)}>
                    📋 Copy
                  </button>
                </div>
                <textarea
                  className="textarea key-textarea"
                  value={privateKey}
                  onChange={(e) => setPrivateKey(e.target.value)}
                  readOnly={mode === 'encrypt'}
                  rows={6}
                />
                <p className="hint">⚠️ Keep this private key secure - you'll need it for decryption!</p>
              </div>
            )}
          </>
        )}

        {/* Info Box */}
        <div className="info-box">
          <h4 className="info-title">ℹ️ How it works</h4>
          {algorithm === 'aes' && (
            <p className="info-text">
              AES (Advanced Encryption Standard) uses the same key for encryption and decryption. 
              The IV (Initialization Vector) adds randomness to ensure the same plaintext encrypts 
              to different ciphertexts each time.
            </p>
          )}
          {algorithm === 'rsa' && (
            <p className="info-text">
              RSA uses a public key for encryption and a private key for decryption. 
              Anyone can encrypt with the public key, but only the holder of the private key can decrypt.
            </p>
          )}
          {algorithm === 'sha256' && (
            <p className="info-text">
              SHA-256 is a one-way cryptographic hash function. It creates a fixed-size 256-bit hash 
              from any input. This process cannot be reversed - perfect for password storage!
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default EncryptionCard
