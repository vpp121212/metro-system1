'use client'

import { useEffect, useState, useRef } from 'react'
import { Bot, Send, User, Sparkles, Loader2, MessageSquare } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import PageHeader from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

const suggestedQuestions = [
  'لخص حالة الشبكة',
  'ما هي أحدث التنبيهات؟',
  'كم عدد القطارات النشطة؟',
  'حالة الخط الأزرق',
]

const initialGreeting: Message = {
  id: 'greeting',
  role: 'assistant',
  content: `مرحباً! أنا مساعد TrainEye AI الذكي. يمكنني مساعدتك في مراقبة وإدارة شبكة مترو الرياض.\n\nيمكنك سؤالي عن:\n• حالة الشبكة العامة\n• التنبيهات النشطة\n• حالة القطارات والأسطول\n• حركة الركاب\n• التأخيرات\n\nكيف يمكنني مساعدتك اليوم؟`,
  timestamp: new Date().toISOString(),
}

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([initialGreeting])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(text: string) {
    if (!text.trim() || sending) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toISOString(),
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setSending(true)

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim() }),
      })

      if (res.ok) {
        const data = await res.json()
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date().toISOString(),
        }
        setMessages(prev => [...prev, aiMsg])
      } else {
        const errorMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'عذراً، حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.',
          timestamp: new Date().toISOString(),
        }
        setMessages(prev => [...prev, errorMsg])
      }
    } catch {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'عذراً، لا أستطيع الاتصال بالخادم حالياً. يرجى التحقق من الاتصال والمحاولة مرة أخرى.',
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setSending(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <PageHeader
        title="المساعد الذكي"
        description="مساعد مدعوم بالذكاء الاصطناعي لإدارة الشبكة"
        actions={
          <Button variant="outline" size="sm" onClick={() => setMessages([initialGreeting])}>
            <MessageSquare className="h-4 w-4 ml-2" /> محادثة جديدة
          </Button>
        }
      />

      <Card className="flex-1 flex flex-col mt-4 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                  msg.role === 'assistant'
                    ? 'bg-gradient-to-br from-t-cyan/20 to-t-blue/20 border border-t-cyan/30'
                    : 'bg-t-blue/20 border border-t-blue/30'
                }`}>
                  {msg.role === 'assistant' ? (
                    <Bot className="h-4 w-4 text-t-cyan" />
                  ) : (
                    <User className="h-4 w-4 text-t-blue" />
                  )}
                </div>
                <div className={`max-w-[75%] rounded-xl px-4 py-3 ${
                  msg.role === 'assistant'
                    ? 'bg-t-card border border-t-border/40'
                    : 'bg-t-blue/20 border border-t-blue/30'
                }`}>
                  <p className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  <p className="text-[9px] text-gray-500 mt-2">
                    {new Date(msg.timestamp).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {sending && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-t-cyan/20 to-t-blue/20 border border-t-cyan/30 flex items-center justify-center">
                <Bot className="h-4 w-4 text-t-cyan" />
              </div>
              <div className="bg-t-card border border-t-border/40 rounded-xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-t-cyan animate-pulse" />
                  <span className="text-xs text-gray-400">جاري التفكير...</span>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {messages.length <= 2 && (
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {suggestedQuestions.map((q) => (
              <Button
                key={q}
                variant="outline"
                size="sm"
                className="text-xs h-8"
                onClick={() => sendMessage(q)}
                disabled={sending}
              >
                <Sparkles className="h-3 w-3 ml-1 text-t-cyan" />
                {q}
              </Button>
            ))}
          </div>
        )}

        <div className="p-4 border-t border-t-border">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="اكتب رسالتك هنا..."
              disabled={sending}
              className="flex-1"
            />
            <Button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || sending}
              size="icon"
              className="shrink-0"
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
