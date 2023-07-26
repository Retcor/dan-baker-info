import React, { useEffect, useRef, useState } from 'react'
import { SERVER_PREFIX } from "../App"
import LoadingSpinner from "./icons/LoadingSpinner.jsx";

const DAN_VOICE = 's3://voice-cloning-zero-shot/0f22b1b5-7ee8-4ad5-a553-9250fd8987cb/me/manifest.json'
const VOICE_MAP = [
  {
    id: DAN_VOICE,
    name: 'Dan Baker'
  }
]

const AudioStreamPlayer = ({ prompt }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)
  const [audioMap, setAudioMap] = useState({})
  const [anchorEl, setAnchorEl] = useState(null)
  const [isVoiceLoading, setIsVoiceLoading] = useState(false)

  useEffect(() => {
    const audioElement = audioRef.current

    const handleAudioEnded = () => {
      setIsPlaying(false)
    }

    audioElement.addEventListener('ended', handleAudioEnded)

    return () => {
      audioElement.removeEventListener('ended', handleAudioEnded)
    }
  }, [])

  const handlePlayButton = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleVoiceSelect = async (voice) => {
    const audioElement = audioRef.current
    handleClose()

    if (!audioMap || !audioMap[voice]) {
      setIsVoiceLoading(true)
      const res = await fetch(`${SERVER_PREFIX}/text/to/speech/v1/convert?prompt=${prompt}&voice=${voice}`)
      const url = await res.text()
      setIsVoiceLoading(false)
      const newAudioMap = {...audioMap}
      newAudioMap[voice] = url
      setAudioMap(newAudioMap)

      audioElement.src = url
      audioElement.play()
    } else {
      audioElement.src = audioMap[voice]
      audioElement.play()
    }

    setIsPlaying(true)
  }

  const handlePause = () => {
    if (isPlaying) {
      const audioElement = audioRef.current
      audioElement.pause()
      setIsPlaying(false)
    }
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  return (
    <div>
      <audio ref={audioRef} />

      {isPlaying ? (
        <button className="mr-2 focus:outline-none" onClick={handlePause}>
          <svg
            className="w-6 h-6 fill-current text-gray hover:text-blue-500"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M14 19h4V5h-4v14zm-6 0h4V5h-4v14z" />
          </svg>
        </button>
      ) : isVoiceLoading ? <LoadingSpinner /> : (
        <button className="mr-2 focus:outline-none" onClick={handlePlayButton}>
          <svg
            className="w-6 h-6 fill-current text-gray hover:text-blue-500"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      )}
      {open && (
        <div style={{top: anchorEl.clientY, left: anchorEl.clientX}} className="absolute z-10">
          <div className="bg-primary border border-gray-600 shadow-lg py-2 rounded w-48">
            <ul>
              {VOICE_MAP.map((voice) => (
                <li
                  key={voice.id}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-600"
                  onClick={() => handleVoiceSelect(voice.id)}
                >
                  {voice.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default AudioStreamPlayer
