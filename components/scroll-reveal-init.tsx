'use client'
import { useEffect } from 'react'

export default function ScrollRevealInit() {
  useEffect(() => {
    const selectors = '.reveal, .reveal-left, .reveal-right'

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    )

    const observe = () =>
      document
        .querySelectorAll(`${selectors}:not(.visible)`)
        .forEach((el) => io.observe(el))

    observe()

    const mo = new MutationObserver(observe)
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [])

  return null
}
