'use client'

import { useEffect, useState } from 'react'

const TEXTS = [
  'I Love English, Design, ML, AI, and Bike',
  "I'm obsessed with travelling",
  'I have many achievements in english competition',
]

const TYPING_SPEED = 70
const DELETING_SPEED = 40
const PAUSE_AFTER_TYPING = 1200
const PAUSE_AFTER_DELETING = 400

export default function Typewriter() {
  const [textIndex, setTextIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [mode, setMode] = useState<'typing' | 'pauseAfterTyping' | 'deleting' | 'pauseAfterDeleting'>('typing')

  useEffect(() => {
    let timeout: NodeJS.Timeout
    const currentText = TEXTS[textIndex]

    switch (mode) {
      case 'typing':
        if (charIndex < currentText.length) {
          timeout = setTimeout(
            () => setCharIndex((prev) => prev + 1),
            TYPING_SPEED
          )
        } else {
          timeout = setTimeout(
            () => setMode('pauseAfterTyping'),
            PAUSE_AFTER_TYPING
          )
        }
        break

      case 'pauseAfterTyping':
        timeout = setTimeout(
          () => setMode('deleting'),
          PAUSE_AFTER_TYPING
        )
        break

      case 'deleting':
        if (charIndex > 0) {
          timeout = setTimeout(
            () => setCharIndex((prev) => prev - 1),
            DELETING_SPEED
          )
        } else {
          timeout = setTimeout(
            () => setMode('pauseAfterDeleting'),
            PAUSE_AFTER_DELETING
          )
        }
        break

      case 'pauseAfterDeleting':
        timeout = setTimeout(() => {
          setTextIndex((prev) => (prev + 1) % TEXTS.length)
          setMode('typing')
        }, PAUSE_AFTER_DELETING)
        break
    }

    return () => clearTimeout(timeout)
  }, [charIndex, mode, textIndex])

  return (
    <p
      className="
        font-cabinet font-semibold
        text-lg sm:text-xl md:text-2xl
        leading-snug
        flex items-center justify-center md:justify-start
        min-h-[2rem]
      "
    >
      <span
        className="
          bg-linear-to-r from-blue-200 via-white to-blue-300
          bg-clip-text text-transparent
        "
      >
        {TEXTS[textIndex].slice(0, charIndex)}
      </span>
      <span className="ml-0.5 text-blue-400 animate-pulse font-light">|</span>
    </p>
  )
}
