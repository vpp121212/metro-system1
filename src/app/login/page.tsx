'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

export default function LoginPage() {
  const [employeeId, setEmployeeId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await login(employeeId, password)
    setLoading(false)
    if (result.ok) {
      router.push('/dashboard')
    } else {
      setError(result.error || 'فشل تسجيل الدخول')
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#a855f7] mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">TrainEye AI</h1>
          <p className="text-gray-400 mt-1">نظام التحكم في مترو الرياض</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#1a1a2e] rounded-2xl p-8 shadow-xl border border-white/5 space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-300 mb-2">رقم الموظف</label>
            <input
              type="text"
              value={employeeId}
              onChange={e => setEmployeeId(e.target.value)}
              className="w-full px-4 py-3 bg-[#0f0f1a] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#6366f1] transition-colors"
              placeholder="أدخل رقمك الوظيفي"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#0f0f1a] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#6366f1] transition-colors"
              placeholder="أدخل كلمة المرور"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>
      </div>
    </div>
  )
}
