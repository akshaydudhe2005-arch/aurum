import { useEffect, useRef } from 'react'

type ProgressInfo = { progress: number; max: number }

type LenisLike = {
  stop: () => void
  start: () => void
}

interface UseSectionScrollLockArgs {
  sectionRef: React.RefObject<HTMLElement | null>
  onDelta: (dy: number) => void
  getProgress: () => ProgressInfo
  enabled?: boolean
}

const getLenis = () => (window as Window & { lenis?: LenisLike }).lenis

const EPS = 0.002

export function useSectionScrollLock({
  sectionRef,
  onDelta,
  getProgress,
  enabled = true,
}: UseSectionScrollLockArgs) {
  const locked = useRef(false)
  const touchStartY = useRef(0)

  useEffect(() => {
    if (!enabled) return
    const section = sectionRef.current
    if (!section) return

    const lock = () => {
      locked.current = true
      getLenis()?.stop()
    }

    const unlock = () => {
      if (!locked.current) return
      locked.current = false
      getLenis()?.start()
      document.documentElement.style.overflow = ''
      document.documentElement.style.touchAction = ''
      document.body.style.touchAction = ''
    }

    const releaseScroll = (dy: number) => {
      unlock()
      if (dy !== 0) {
        requestAnimationFrame(() => {
          window.scrollBy({ top: dy, left: 0, behavior: 'auto' })
          getLenis()?.start()
        })
      }
    }

    const handleDelta = (dy: number, e: { preventDefault: () => void }) => {
      if (dy === 0) return

      const rect = section.getBoundingClientRect()
      if (locked.current && rect.bottom <= EPS) {
        unlock()
        return
      }
      if (locked.current && rect.top >= window.innerHeight - EPS) {
        unlock()
        return
      }

      if (!locked.current) {
        if (dy > 0 && rect.top > EPS && rect.top < window.innerHeight) {
          if (rect.top - dy <= EPS) {
            e.preventDefault()
            window.scrollTo({ top: window.scrollY + rect.top, behavior: 'auto' })
            lock()
            const leftover = dy - rect.top
            if (leftover > EPS) onDelta(leftover)
          }
          return
        }

        if (dy < 0 && rect.top < -EPS && rect.bottom > 0) {
          if (rect.top - dy >= -EPS) {
            e.preventDefault()
            window.scrollTo({ top: window.scrollY + rect.top, behavior: 'auto' })
            lock()
            const leftover = dy - rect.top
            if (leftover < -EPS) onDelta(leftover)
          }
          return
        }

        return
      }

      const { progress, max } = getProgress()
      const atStart = progress <= EPS
      const atEnd = progress >= max - EPS

      if (dy > 0 && atEnd) {
        e.preventDefault()
        releaseScroll(dy)
        return
      }
      if (dy < 0 && atStart) {
        e.preventDefault()
        releaseScroll(dy)
        return
      }

      e.preventDefault()
      onDelta(dy)
    }

    const onWheel = (e: WheelEvent) => {
      const rect = section.getBoundingClientRect()
      if (!locked.current && (rect.bottom < 0 || rect.top > window.innerHeight)) return
      handleDelta(e.deltaY, e)
    }
    const NEAR_DOCK_BUFFER = window.innerHeight * 1.5

    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY
      const rect = section.getBoundingClientRect()
      if (locked.current || Math.abs(rect.top) < NEAR_DOCK_BUFFER) {
        document.documentElement.style.touchAction = 'none'
      }
    }
    const onTouchEnd = () => {
      if (!locked.current) {
        document.documentElement.style.touchAction = ''
      }
    }
    const onTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY
      const dy = touchStartY.current - currentY 
      touchStartY.current = currentY
      handleDelta(dy, e)
    }
    window.addEventListener('wheel', onWheel, { passive: false, capture: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true, capture: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false, capture: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true, capture: true })

    return () => {
      window.removeEventListener('wheel', onWheel, { capture: true } as EventListenerOptions)
      window.removeEventListener('touchstart', onTouchStart, { capture: true } as EventListenerOptions)
      window.removeEventListener('touchmove', onTouchMove, { capture: true } as EventListenerOptions)
      window.removeEventListener('touchend', onTouchEnd, { capture: true } as EventListenerOptions)
      document.documentElement.style.touchAction = ''
      document.documentElement.style.overflow = ''
      document.body.style.touchAction = ''
      unlock()
    }
  }, [sectionRef, onDelta, getProgress, enabled])
}