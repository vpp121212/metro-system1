import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-t-cyan/30 border-t-t-cyan animate-spin" />
        </div>
        <p className="text-sm text-gray-500">جاري التحميل...</p>
      </div>
    </div>
  )
}
