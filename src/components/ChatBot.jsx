import { useState, useRef, useEffect } from 'react'
import { SERVER_PREFIX } from '../App'

const SpeakerIcon = () => (
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-4 h-4'>
    <path d='M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z' />
    <path d='M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.061z' />
  </svg>
)

const StopIcon = () => (
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-4 h-4'>
    <path fillRule='evenodd' d='M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z' clipRule='evenodd' />
  </svg>
)

const SendIcon = () => (
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-5 h-5'>
    <path d='M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z' />
  </svg>
)

const ChatIcon = () => (
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-6 h-6'>
    <path fillRule='evenodd' d='M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97z' clipRule='evenodd' />
  </svg>
)

const CloseIcon = () => (
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-5 h-5'>
    <path fillRule='evenodd' d='M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z' clipRule='evenodd' />
  </svg>
)

const LoadingDots = () => (
  <div className='flex gap-1 items-center py-1'>
    <div className='w-2 h-2 rounded-full bg-secondary animate-bounce' style={{ animationDelay: '0ms' }} />
    <div className='w-2 h-2 rounded-full bg-secondary animate-bounce' style={{ animationDelay: '150ms' }} />
    <div className='w-2 h-2 rounded-full bg-secondary animate-bounce' style={{ animationDelay: '300ms' }} />
  </div>
)

export default function ChatBot () {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm an AI assistant representing Dan. Ask me anything about his experience, skills, or what he's looking for in his next role."
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [playingIndex, setPlayingIndex] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const audioRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const sendMessage = async () => {
    const question = input.trim()
    if (!question || isLoading) return

    const userMessage = { role: 'user', content: question }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setIsLoading(true)

    try {
      const history = updatedMessages
        .slice(1) // skip the initial greeting
        .slice(-6) // last 3 exchanges
        .map(m => ({ role: m.role, content: m.content }))

      const res = await fetch(`${SERVER_PREFIX}/chatbot/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, history })
      })

      if (!res.ok) throw new Error('Request failed')
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting right now. Please try again in a moment."
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const speakMessage = (text, index) => {
    if (audioRef.current) {
      audioRef.current.onended = null
      audioRef.current.onerror = null
      audioRef.current.pause()
      audioRef.current.src = ''
    }

    if (playingIndex === index) {
      setPlayingIndex(null)
      return
    }

    const audio = new Audio(`${SERVER_PREFIX}/chatbot/speak?text=${encodeURIComponent(text)}`)
    audioRef.current = audio
    setPlayingIndex(index)
    audio.play()
    audio.onended = () => setPlayingIndex(null)
    audio.onerror = () => setPlayingIndex(null)
  }

  return (
    <div className='fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3'>
      {/* Chat panel */}
      {isOpen && (
        <div
          className='flex flex-col rounded-2xl shadow-2xl overflow-hidden'
          style={{
            width: '360px',
            height: '500px',
            background: '#151030',
            border: '1px solid rgba(170, 166, 195, 0.15)'
          }}
        >
          {/* Header */}
          <div className='flex items-center justify-between px-4 py-3' style={{ background: '#100d25', borderBottom: '1px solid rgba(170, 166, 195, 0.1)' }}>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white' style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                D
              </div>
              <div>
                <p className='text-white-100 text-sm font-semibold leading-tight'>Ask about Dan</p>
                <p className='text-secondary text-xs'>AI-powered · Usually responds instantly</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className='text-secondary hover:text-white-100 transition-colors'>
              <CloseIcon />
            </button>
          </div>

          {/* Messages */}
          <div className='flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3' style={{ scrollbarWidth: 'thin' }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant'
                  ? (
                    <div className='flex flex-col gap-1 max-w-[85%]'>
                      <div className='rounded-2xl rounded-tl-sm px-3 py-2 text-sm text-white-100 leading-relaxed' style={{ background: '#1d1836' }}>
                        {msg.content}
                      </div>
                      <button
                        onClick={() => speakMessage(msg.content, i)}
                        className={`self-start flex items-center gap-1 text-xs px-2 py-1 rounded-full transition-all duration-200 ${playingIndex === i ? 'text-violet-400' : 'text-secondary hover:text-white-100'}`}
                        title={playingIndex === i ? 'Stop' : "Hear this in Dan's voice"}
                      >
                        {playingIndex === i ? <StopIcon /> : <SpeakerIcon />}
                        <span>{playingIndex === i ? 'Stop' : "Dan's voice"}</span>
                      </button>
                    </div>
                    )
                  : (
                    <div className='rounded-2xl rounded-tr-sm px-3 py-2 text-sm text-white leading-relaxed max-w-[85%]' style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                      {msg.content}
                    </div>
                    )}
              </div>
            ))}
            {isLoading && (
              <div className='flex justify-start'>
                <div className='rounded-2xl rounded-tl-sm px-3 py-2' style={{ background: '#1d1836' }}>
                  <LoadingDots />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className='px-3 py-3' style={{ borderTop: '1px solid rgba(170, 166, 195, 0.1)', background: '#100d25' }}>
            <div className='flex items-end gap-2 rounded-xl px-3 py-2' style={{ background: '#151030', border: '1px solid rgba(170, 166, 195, 0.2)' }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder='Ask me anything about Dan...'
                rows={1}
                className='flex-1 bg-transparent text-sm text-white-100 placeholder-secondary resize-none outline-none leading-relaxed'
                style={{ maxHeight: '80px' }}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className='text-violet-400 hover:text-violet-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex-shrink-0 mb-0.5'
              >
                <SendIcon />
              </button>
            </div>
            <p className='text-center text-xs mt-1.5' style={{ color: 'rgba(170, 166, 195, 0.5)' }}>
              Powered by AI · Answers may not be 100% accurate
            </p>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(o => !o)}
        className='w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 hover:scale-105 active:scale-95'
        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
        title="Chat with Dan's AI assistant"
      >
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </button>
    </div>
  )
}
