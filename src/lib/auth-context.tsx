'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  employeeId: string
  name: string
  email: string
  role: string
  stationId: string | null
  stationName: string | null
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (employeeId: string, password: string) => Promise<{ ok: boolean; error?: string }>
  logout: () => Promise<void>
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => ({ ok: false }),
  logout: async () => {},
  hasPermission: () => false,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch('/api/auth/me')
        if (res.ok) setUser(await res.json())
      } catch {} finally { setLoading(false) }
    }
    loadUser()
  }, [])

  async function login(employeeId: string, password: string) {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId, password }),
      })
      const data = await res.json()
      if (!res.ok) return { ok: false, error: data.error || 'فشل تسجيل الدخول' }
      setUser(data.user)
      return { ok: true }
    } catch {
      return { ok: false, error: 'خطأ في الاتصال' }
    }
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    router.push('/login')
  }

  function hasPermission(permission: string): boolean {
    if (!user) return false
    if (user.role === 'OPERATIONS') return true
    return false
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
