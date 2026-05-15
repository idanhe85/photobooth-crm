'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(false)

    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/')
      router.refresh()
    } else {
      setError(true)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F6F8] flex items-center justify-center p-4">
      <div className="bg-white border border-[#E6E9EF] rounded-2xl shadow-sm p-10 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-[#CC9933] font-black text-2xl tracking-wide mb-1">
            THE PHOTO<span className="text-[#333333]">DUDE</span>
          </div>
          <div className="text-[#9699A6] text-xs tracking-widest">CRM SYSTEM</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[#676879] text-sm block mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password..."
              autoFocus
              className={`w-full bg-[#F5F6F8] border rounded-xl px-4 py-3 text-[#333333] text-sm outline-none transition-colors ${
                error ? 'border-red-400 focus:border-red-400' : 'border-[#E6E9EF] focus:border-[#CC9933]/50'
              }`}
            />
            {error && (
              <p className="text-red-400 text-xs mt-2">Wrong password. Try again.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-[#CC9933] hover:bg-[#DDB84D] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all text-sm"
          >
            {loading ? 'Checking...' : 'Enter CRM'}
          </button>
        </form>
      </div>
    </div>
  )
}
