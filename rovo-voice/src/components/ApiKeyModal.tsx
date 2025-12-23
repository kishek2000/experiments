import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Key, Eye, EyeOff } from 'lucide-react'
import { getStoredApiKeys, setStoredApiKeys } from '../services/api'
import styles from './ApiKeyModal.module.css'

interface ApiKeyModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
}

export function ApiKeyModal({ isOpen, onClose, onSave }: ApiKeyModalProps) {
  const [claudeKey, setClaudeKey] = useState('')
  const [openaiKey, setOpenaiKey] = useState('')
  const [showClaude, setShowClaude] = useState(false)
  const [showOpenai, setShowOpenai] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const stored = getStoredApiKeys()
      setClaudeKey(stored.claudeApiKey)
      setOpenaiKey(stored.openaiApiKey)
    }
  }, [isOpen])

  const handleSave = () => {
    setStoredApiKeys({
      claudeApiKey: claudeKey,
      openaiApiKey: openaiKey
    })
    onSave()
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
          >
            <div className={styles.header}>
              <div className={styles.headerIcon}>
                <Key size={20} />
              </div>
              <h2 className={styles.title}>API Configuration</h2>
              <button className={styles.closeBtn} onClick={onClose}>
                <X size={18} />
              </button>
            </div>

            <div className={styles.content}>
              <p className={styles.description}>
                Enter your API keys to enable voice transcription and image analysis. 
                Keys are stored locally in your browser.
              </p>

              <div className={styles.field}>
                <label className={styles.label}>
                  Claude API Key (Anthropic)
                  <span className={styles.hint}>For vision analysis</span>
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    type={showClaude ? 'text' : 'password'}
                    className={styles.input}
                    value={claudeKey}
                    onChange={(e) => setClaudeKey(e.target.value)}
                    placeholder="sk-ant-..."
                  />
                  <button
                    className={styles.toggleBtn}
                    onClick={() => setShowClaude(!showClaude)}
                  >
                    {showClaude ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  OpenAI API Key
                  <span className={styles.hint}>For Whisper transcription</span>
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    type={showOpenai ? 'text' : 'password'}
                    className={styles.input}
                    value={openaiKey}
                    onChange={(e) => setOpenaiKey(e.target.value)}
                    placeholder="sk-..."
                  />
                  <button
                    className={styles.toggleBtn}
                    onClick={() => setShowOpenai(!showOpenai)}
                  >
                    {showOpenai ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className={styles.note}>
                <strong>Note:</strong> Without API keys, the app will use simulated responses.
              </div>
            </div>

            <div className={styles.footer}>
              <button className={styles.cancelBtn} onClick={onClose}>
                Cancel
              </button>
              <button className={styles.saveBtn} onClick={handleSave}>
                Save Keys
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

