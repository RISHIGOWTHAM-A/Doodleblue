import { useEffect, useRef, useState } from 'react'

function SortSelect({ options, value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const current = options.find((o) => o.value === value)

  return (
    <div className="sortsel" ref={ref}>
      <button
        type="button"
        className="sortsel-btn"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {current?.label}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          aria-hidden="true"
          className={open ? 'chev open' : 'chev'}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul className="sortsel-menu" role="listbox" aria-label="Sort options">
          {options.map((o) => (
            <li key={o.value} role="option" aria-selected={o.value === value}>
              <button
                type="button"
                className={
                  o.value === value ? 'sortsel-opt active' : 'sortsel-opt'
                }
                onClick={() => {
                  onChange(o.value)
                  setOpen(false)
                }}
              >
                {o.label}
                {o.value === value && (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    aria-hidden="true"
                  >
                    <path d="m5 13 4 4L19 7" />
                  </svg>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SortSelect
