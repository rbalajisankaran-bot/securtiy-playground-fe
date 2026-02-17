import { useState } from 'react'
import './App.css'
import EncryptionCard from './components/EncryptionCard'

function App() {
  const [selectedAlgo, setSelectedAlgo] = useState('aes')

  const algorithms = [
    {
      id: 'aes',
      name: 'AES-256',
      description: 'Symmetric encryption - Same key encrypts & decrypts',
      icon: '🔐',
      color: '#6366f1'
    },
    {
      id: 'rsa',
      name: 'RSA-2048',
      description: 'Asymmetric encryption - Public/Private key pair',
      icon: '🔑',
      color: '#a78bfa'
    },
    {
      id: 'sha256',
      name: 'SHA-256',
      description: 'One-way hashing - Cannot be decrypted',
      icon: '🔒',
      color: '#f43f5e'
    }
  ]

  return (
    <div className="app">
      <header className="header fade-in">
        <div className="header-content">
          <h1 className="title">
            <span className="icon">🛡️</span>
            Encryption Playground
          </h1>
          <p className="subtitle">Test and learn different encryption methods</p>
        </div>
      </header>

      <main className="main-content">
        <section className="algo-selector slide-in">
          <h2 className="section-title">Choose Algorithm</h2>
          <div className="algo-grid">
            {algorithms.map((algo) => (
              <button
                key={algo.id}
                className={`algo-card ${selectedAlgo === algo.id ? 'active' : ''}`}
                onClick={() => setSelectedAlgo(algo.id)}
                style={{ '--card-color': algo.color }}
              >
                <span className="algo-icon">{algo.icon}</span>
                <h3 className="algo-name">{algo.name}</h3>
                <p className="algo-desc">{algo.description}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="encryption-section fade-in">
          <EncryptionCard algorithm={selectedAlgo} />
        </section>
      </main>

      <footer className="footer">
        <p>Built with ❤️ for Security Enthusiasts | Backend: NestJS | Frontend: React + Vite</p>
      </footer>
    </div>
  )
}

export default App
