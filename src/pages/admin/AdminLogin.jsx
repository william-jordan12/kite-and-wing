import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminLogin, setToken } from '../../api.js'
import '../admin.css'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (ev) => {
    ev.preventDefault()
    setBusy(true)
    setError('')
    try {
      const { token } = await adminLogin(username, password)
      setToken(token)
      navigate('/admin/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="admin-page">
      <form className="admin-login" onSubmit={submit}>
        <h1>Admin</h1>
        <p>Sign in to manage products and orders.</p>
        <div className="field">
          <label htmlFor="admin-user">Username</label>
          <input id="admin-user" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
        </div>
        <div className="field">
          <label htmlFor="admin-pass">Password</label>
          <input
            id="admin-pass"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        {error && <p className="field-error">{error}</p>}
        <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
