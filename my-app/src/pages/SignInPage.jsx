import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Link, useNavigate, useSearchParams } from 'react-router'
import { z } from 'zod'
import { selectUser, signIn } from '../features/auth/authSlice'
import { addToast } from '../features/ui/uiSlice'
import { createUser, verifyUser } from '../utils/users'

const signinSchema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
})

const signupSchema = signinSchema
  .extend({
    name: z.string().trim().min(2, 'Enter your name'),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    path: ['confirm'],
    message: 'Passwords do not match',
  })

const EMPTY_FORM = { name: '', email: '', password: '', confirm: '' }

function Field({ label, name, error, ...props }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input name={name} {...props} className={error ? 'invalid' : ''} />
      {error && <em className="field-error">{error}</em>}
    </label>
  )
}

function SignInPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const user = useSelector(selectUser)
  const next = params.get('next') || '/profile'

  const [mode, setMode] = useState('signin')
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [notice, setNotice] = useState('')

  if (user) return <Navigate to={next} replace />

  const update = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    setErrors((errs) => ({ ...errs, [name]: undefined }))
    setFormError('')
    setNotice('')
  }

  const switchMode = (m) => {
    setMode(m)
    setErrors({})
    setFormError('')
    setNotice('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const schema = mode === 'signup' ? signupSchema : signinSchema
    const result = schema.safeParse(form)
    if (!result.success) {
      const fieldErrors = {}
      for (const issue of result.error.issues) {
        const key = issue.path[0]
        if (!fieldErrors[key]) fieldErrors[key] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    const { name, email, password } = result.data
    const res =
      mode === 'signup'
        ? await createUser({ name, email, password })
        : await verifyUser(email, password)

    if (res.error) {
      setFormError(res.error)
      return
    }

    if (mode === 'signup') {
      dispatch(addToast('Account created — sign in to continue'))
      setMode('signin')
      setForm({ ...EMPTY_FORM, email })
      setErrors({})
      setNotice('Account created — sign in with your email and password')
      return
    }

    dispatch(signIn(res.user))
    dispatch(addToast(`Welcome back, ${res.user.name.split(' ')[0]}!`))
    navigate(next, { replace: true })
  }

  return (
    <main className="page auth-page">
      <form className="card-panel auth-card" onSubmit={handleSubmit}>
        <div className="auth-icon" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
          </svg>
        </div>
        <h1>{mode === 'signup' ? 'Create account' : 'Sign in'}</h1>
        <p className="muted">
          {mode === 'signup'
            ? 'Your account is saved on this device — demo only.'
            : 'Sign in to checkout and track your orders.'}
        </p>

        <div className="auth-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'signin'}
            className={mode === 'signin' ? 'auth-tab active' : 'auth-tab'}
            onClick={() => switchMode('signin')}
          >
            Sign in
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'signup'}
            className={mode === 'signup' ? 'auth-tab active' : 'auth-tab'}
            onClick={() => switchMode('signup')}
          >
            Sign up
          </button>
        </div>

        {mode === 'signup' && (
          <Field
            label="Name"
            name="name"
            value={form.name}
            onChange={update}
            error={errors.name}
            placeholder="Rishi"
          />
        )}
        <Field
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={update}
          error={errors.email}
          placeholder="rishi@example.com"
        />
        <Field
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={update}
          error={errors.password}
          placeholder={
            mode === 'signup' ? 'Create a password' : 'Enter your password'
          }
          autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
        />
        {mode === 'signup' && (
          <Field
            label="Confirm password"
            name="confirm"
            type="password"
            value={form.confirm}
            onChange={update}
            error={errors.confirm}
            placeholder="Repeat the password"
            autoComplete="new-password"
          />
        )}

        {notice && <p className="form-notice">{notice}</p>}
        {formError && <p className="form-error">{formError}</p>}

        <button type="submit" className="btn btn-primary btn-lg btn-block">
          {mode === 'signup' ? 'Create account' : 'Sign in'}
        </button>
        <p className="muted auth-alt">
          Just browsing? <Link to="/">Continue shopping</Link>
        </p>
      </form>
    </main>
  )
}

export default SignInPage

