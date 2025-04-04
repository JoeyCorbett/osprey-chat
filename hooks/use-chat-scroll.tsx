import { useCallback, useLayoutEffect, useRef, useState } from 'react'

export function useChatScroll() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isUserAtBottom, setIsUserAtBottom] = useState(true)

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'auto') => {
    const el = containerRef.current
    if (!el) return

    el.scrollTo({
      top: el.scrollHeight,
      behavior,
    })
  }, [])

  useLayoutEffect(() => {
    scrollToBottom('auto')
  }, [scrollToBottom])

  const handleScroll = useCallback(() => {
    const el = containerRef.current
    if (!el) return

    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    setIsUserAtBottom(distanceFromBottom < 50)
  }, [])

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return

    el.addEventListener('scroll', handleScroll)
    return () => el.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return {
    containerRef,
    scrollToBottom,
    isUserAtBottom,
  }
}
