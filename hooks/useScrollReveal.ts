import { useEffect, RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

type RevealPreset = 'fade-up' | 'clip-reveal' | 'stagger'

export interface ScrollRevealOptions {
  preset: RevealPreset
  staggerTargets?: string   // CSS selector for stagger children
  staggerDelay?: number     // default 0.1s
  start?: string            // ScrollTrigger start, default "top 85%"
  duration?: number
  ease?: string
  once?: boolean            // default true
}

/**
 * Custom hook for scroll-triggered reveal animations using GSAP ScrollTrigger.
 * 
 * Presets:
 * - fade-up: Elements fade in and move up from below
 * - clip-reveal: Elements reveal from bottom using clipPath
 * - stagger: Applies fade-up to multiple children with delay
 * 
 * Respects prefers-reduced-motion by skipping animations and showing final state.
 */
export function useScrollReveal(
  ref: RefObject<HTMLElement | null>,
  options: ScrollRevealOptions
): void {
  const {
    preset,
    staggerTargets,
    staggerDelay = 0.1,
    start = 'top 85%',
    duration = 1.0,
    ease = 'power4.out',
    once = true
  } = options

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!ref.current) return

    // Check for prefers-reduced-motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Create GSAP context for cleanup
    const ctx = gsap.context(() => {
      const element = ref.current
      if (!element) return

      // If reduced motion is preferred, set elements to final state immediately
      if (prefersReduced) {
        if (preset === 'fade-up') {
          gsap.set(element, { y: 0, opacity: 1 })
        } else if (preset === 'clip-reveal') {
          gsap.set(element, { clipPath: 'inset(0% 0% 0% 0%)' })
        } else if (preset === 'stagger' && staggerTargets) {
          const targets = element.querySelectorAll(staggerTargets)
          gsap.set(targets, { y: 0, opacity: 1 })
        }
        return
      }

      // Apply preset animations
      switch (preset) {
        case 'fade-up': {
          // Set initial state
          gsap.set(element, { y: 60, opacity: 0 })

          // Animate to final state
          gsap.to(element, {
            y: 0,
            opacity: 1,
            duration,
            ease,
            scrollTrigger: {
              trigger: element,
              start,
              once,
            }
          })
          break
        }

        case 'clip-reveal': {
          // Set initial state
          gsap.set(element, { clipPath: 'inset(0% 0% 100% 0%)' })

          // Animate to final state
          gsap.to(element, {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration,
            ease,
            scrollTrigger: {
              trigger: element,
              start,
              once,
            }
          })
          break
        }

        case 'stagger': {
          if (!staggerTargets) {
            console.warn('useScrollReveal: stagger preset requires staggerTargets option')
            return
          }

          const targets = element.querySelectorAll(staggerTargets)
          if (targets.length === 0) {
            console.warn(`useScrollReveal: no elements found matching selector "${staggerTargets}"`)
            return
          }

          // Set initial state for all targets
          gsap.set(targets, { y: 60, opacity: 0 })

          // Animate with stagger
          gsap.to(targets, {
            y: 0,
            opacity: 1,
            duration,
            ease,
            stagger: staggerDelay,
            scrollTrigger: {
              trigger: element,
              start,
              once,
            }
          })
          break
        }

        default:
          console.warn(`useScrollReveal: unknown preset "${preset}"`)
      }
    }, ref)

    // Cleanup: revert all animations and kill ScrollTriggers
    return () => {
      ctx.revert()
    }
  }, [ref, preset, staggerTargets, staggerDelay, start, duration, ease, once])
}
