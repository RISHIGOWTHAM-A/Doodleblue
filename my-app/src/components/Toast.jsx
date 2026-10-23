import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { removeToast } from '../features/ui/uiSlice'

function ToastItem({ toast }) {
  const dispatch = useDispatch()

  useEffect(() => {
    const timer = setTimeout(() => dispatch(removeToast(toast.id)), 2600)
    return () => clearTimeout(timer)
  }, [toast.id, dispatch])

  return (
    <div className="toast" role="status">
      <span className="toast-icon">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          aria-hidden="true"
        >
          <path d="m5 13 4 4L19 7" />
        </svg>
      </span>
      {toast.message}
    </div>
  )
}

function ToastHost() {
  const toasts = useSelector((state) => state.ui.toasts)

  return (
    <div className="toast-host" aria-live="polite">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  )
}

export default ToastHost
