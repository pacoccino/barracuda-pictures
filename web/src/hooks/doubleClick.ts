import { useRef } from 'react'

interface UseDoubleClickParams {
  onSingleClick?: () => void
  onDoubleClick?: () => void
  onMoreClick?: (number) => void
}
interface UseDoubleClickReturn {
  clickHandler: (number) => void
}

const DOUBLE_CLICK_TIMEOUT = 200

export const useDoubleClick = ({
  onSingleClick,
  onDoubleClick,
  onMoreClick,
}: UseDoubleClickParams): UseDoubleClickReturn => {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const nbClicks = useRef<number>(0)

  function clickHandler() {
    clearTimeout(timer.current)
    nbClicks.current++

    timer.current = setTimeout(() => {
      if (onSingleClick && nbClicks.current === 1) onSingleClick()
      if (onDoubleClick && nbClicks.current === 2) onDoubleClick()
      if (onMoreClick && nbClicks.current > 2) onMoreClick(nbClicks.current)

      nbClicks.current = 0
    }, DOUBLE_CLICK_TIMEOUT)
  }

  return {
    clickHandler,
  }
}
