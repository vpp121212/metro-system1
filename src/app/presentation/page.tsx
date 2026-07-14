'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const slides = [
  {
    id: 'title',
    en: {
      title: 'TrainEye AI',
      subtitle: 'Riyadh Metro Command Center',
      tagline: 'Next-Generation Intelligent Metro Operations Platform',
    },
    ar: {
      title: 'ذكاء القطار',
      subtitle: 'مركز التحكم بمترو الرياض',
      tagline: 'الجيل التالي من منصات إدارة عمليات المترو الذكية',
    },
  },
  {
    id: 'overview',
    en: {
      title: 'Platform Overview',
      subtitle: 'A unified command & control system for Riyadh Metro',
      items: [
        '6 metro lines with real-time tracking',
        'AI-powered predictive analytics',
        'Centralized incident management',
        'Multi-role access control (RBAC)',
        'Live passenger flow monitoring',
        'Automated alert & notification system',
      ],
    },
    ar: {
      title: 'نظرة عامة',
      subtitle: 'نظام موحد للقيادة والتحكم لمترو الرياض',
      items: [
        '6 خطوط مترو مع تتبع فوري',
        'تحليلات تنبؤية بالذكاء الاصطناعي',
        'إدارة مركزية للبلاغات',
        'التحكم بالصلاحيات لأنماط متعددة',
        'مراقبة حية لتدفق الركاب',
        'نظام آلي للتنبيهات والإشعارات',
      ],
    },
  },
  {
    id: 'features',
    en: {
      title: 'Core Capabilities',
      subtitle: 'Powerful tools for metro operations',
      features: [
        { icon: '🗺️', name: 'Interactive Map', desc: 'Real-time train positions, station status, line health' },
        { icon: '🤖', name: 'AI Assistant', desc: 'Natural language queries, predictive insights, automated reports' },
        { icon: '📊', name: 'Analytics Hub', desc: 'Passenger flow, delays, performance metrics, line distribution' },
        { icon: '🚨', name: 'Alert System', desc: 'Multi-level alerts, acknowledgment workflow, priority matrix' },
        { icon: '📹', name: 'Camera Integration', desc: 'Live camera feeds, station monitoring, security oversight' },
        { icon: '📋', name: 'Incident Reports', desc: 'Digital reporting, assignment tracking, resolution workflow' },
        { icon: '⚙️', name: 'Fleet Management', desc: 'Train status, maintenance scheduling, capacity monitoring' },
        { icon: '📈', name: 'Historical Data', desc: 'Trip history, playback mode, trend analysis, audit logs' },
      ],
    },
    ar: {
      title: 'الإمكانيات الأساسية',
      subtitle: 'أدوات قوية لعمليات المترو',
      features: [
        { icon: '🗺️', name: 'الخريطة التفاعلية', desc: 'مواقع القطارات فورياً، حالة المحطات، صحة الخطوط' },
        { icon: '🤖', name: 'المساعد الذكي', desc: 'استفسارات باللغة الطبيعية، تحليلات تنبؤية، تقارير آلية' },
        { icon: '📊', name: 'مركز التحليلات', desc: 'تدفق الركاب، التأخيرات، مقاييس الأداء، توزيع الخطوط' },
        { icon: '🚨', name: 'نظام التنبيهات', desc: 'تنبيهات متعددة المستويات، سير عمل الإقرار، مصفوفة الأولويات' },
        { icon: '📹', name: 'كاميرات المراقبة', desc: 'بث مباشر، مراقبة المحطات، الإشراف الأمني' },
        { icon: '📋', name: 'بلاغات الحوادث', desc: 'إبلاغ رقمي، تتبع التكليف، سير عمل الحل' },
        { icon: '⚙️', name: 'إدارة الأسطول', desc: 'حالة القطارات، جدولة الصيانة، مراقبة السعة' },
        { icon: '📈', name: 'البيانات التاريخية', desc: 'سجل الرحلات، وضع إعادة التشغيل، تحليل الاتجاهات' },
      ],
    },
  },
  {
    id: 'map',
    en: {
      title: 'Live Metro Map',
      subtitle: 'Real-time visualization of the entire Riyadh Metro network',
      lines: [
        { name: 'Blue Line', color: '#2563eb', stations: 25, desc: 'North-South corridor via city center' },
        { name: 'Red Line', color: '#dc2626', stations: 15, desc: 'East-West axis connecting universities' },
        { name: 'Orange Line', color: '#ea580c', stations: 22, desc: 'Longest line serving industrial zones' },
        { name: 'Yellow Line', color: '#eab308', stations: 9, desc: 'Airport express connector' },
        { name: 'Green Line', color: '#16a34a', stations: 12, desc: 'Government district loop' },
        { name: 'Purple Line', color: '#9333ea', stations: 11, desc: 'Cultural & commercial district link' },
      ],
    },
    ar: {
      title: 'خريطة المترو الحية',
      subtitle: 'تصور فوري لشبكة مترو الرياض بأكملها',
      lines: [
        { name: 'الخط الأزرق', color: '#2563eb', stations: 25, desc: 'ممر شمال-جنوب عبر وسط المدينة' },
        { name: 'الخط الأحمر', color: '#dc2626', stations: 15, desc: 'محور شرق-غرب يربط الجامعات' },
        { name: 'الخط البرتقالي', color: '#ea580c', stations: 22, desc: 'أطول خط يخدم المناطق الصناعية' },
        { name: 'الخط الأصفر', color: '#eab308', stations: 9, desc: 'موصل المطار السريع' },
        { name: 'الخط الأخضر', color: '#16a34a', stations: 12, desc: 'حلقة المنطقة الحكومية' },
        { name: 'الخط البنفسجي', color: '#9333ea', stations: 11, desc: 'رابط المناطق الثقافية والتجارية' },
      ],
    },
  },
  {
    id: 'analytics',
    en: {
      title: 'AI-Powered Analytics',
      subtitle: 'Data-driven insights for smarter metro operations',
      metrics: [
        { value: '98.5%', label: 'System Reliability', desc: 'Consistent uptime across all systems' },
        { value: '95.2%', label: 'On-Time Performance', desc: 'Trains arriving within scheduled window' },
        { value: '500K+', label: 'Daily Passengers', desc: 'Average ridership across all lines' },
        { value: '<5min', label: 'Avg Response Time', desc: 'Alert acknowledgment & dispatch' },
      ],
      features: [
        'Predictive delay forecasting using ML models',
        'Passenger flow heatmaps with peak-hour analysis',
        'Line distribution & utilization metrics',
        'Automated weekly performance reports',
        'Station density monitoring & crowd prediction',
      ],
    },
    ar: {
      title: 'تحليلات الذكاء الاصطناعي',
      subtitle: 'رؤى تعتمد على البيانات لعمليات مترو أكثر ذكاءً',
      metrics: [
        { value: '٩٨.٥٪', label: 'موثوقية النظام', desc: 'وقت تشغيل ثابت عبر جميع الأنظمة' },
        { value: '٩٥.٢٪', label: 'الأداء في الوقت', desc: 'قطارات تصل ضمن الإطار الزمني' },
        { value: '٥٠٠ ألف+', label: 'الركاب يومياً', desc: 'متوسط عدد الركاب عبر جميع الخطوط' },
        { value: 'أقل من ٥ د', label: 'متوسط وقت الاستجابة', desc: 'إقرار التنبيهات والتوجيه' },
      ],
      features: [
        'التنبؤ بالتأخيرات باستخدام نماذج التعلم الآلي',
        'خرائط حرارية لتدفق الركاب مع تحليل ساعات الذروة',
        'مقاييس توزيع الخطوط والاستفادة منها',
        'تقارير أداء أسبوعية آلية',
        'مراقبة كثافة المحطات والتنبؤ بالازدحام',
      ],
    },
  },
  {
    id: 'security',
    en: {
      title: 'Enterprise Security',
      subtitle: 'Defense-in-depth security protecting metro operations',
      layers: [
        { name: 'JWT Authentication', desc: 'Signed session tokens with 24-hour expiration' },
        { name: 'Role-Based Access Control', desc: 'Granular permissions: OPERATIONS, STATION_MANAGER, SECURITY' },
        { name: 'Rate Limiting', desc: '5 login attempts/minute per IP - brute force protection' },
        { name: 'Audit Logging', desc: 'Complete trail of all system actions & changes' },
        { name: 'Security Headers', desc: 'HSTS, X-Frame-Options, CSP, X-Content-Type-Options' },
        { name: 'Session Hardening', desc: 'HttpOnly, Secure, SameSite=Strict cookies' },
      ],
    },
    ar: {
      title: 'الأمان المؤسسي',
      subtitle: 'حماية متعددة الطبقات لعمليات المترو',
      layers: [
        { name: 'المصادقة بالرمز المميز', desc: 'رموز جلسة موقعة تنتهي بعد ٢٤ ساعة' },
        { name: 'التحكم بالصلاحيات', desc: 'صلاحيات دقيقة: عمليات، مدير محطة، أمن' },
        { name: 'تحديد المعدل', desc: '٥ محاولات تسجيل دخول/الدقيقة لكل عنوان - حماية من التخمين' },
        { name: 'سجل التدقيق', desc: 'سجل كامل لجميع إجراءات وتغييرات النظام' },
        { name: 'ترويسات الأمان', desc: 'CSP, HSTS, X-Frame-Options, X-Content-Type-Options' },
        { name: 'تقوية الجلسة', desc: 'كوكي آمنة HttpOnly, Secure, SameSite=Strict' },
      ],
    },
  },
  {
    id: 'tech',
    en: {
      title: 'Technology Stack',
      subtitle: 'Modern, scalable architecture',
      frontend: ['Next.js 14', 'React 18', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'MapLibre GL'],
      backend: ['Next.js API Routes', 'Prisma ORM', 'SQLite / PostgreSQL', 'JWT (jose)', 'bcryptjs'],
      devops: ['Docker', 'Render Cloud', 'Vercel', 'Git', 'CI/CD Pipeline'],
      integrations: ['MapLibre GL JS', 'Sonner Toasts', 'shadcn/ui', 'next-themes'],
    },
    ar: {
      title: 'التقنيات المستخدمة',
      subtitle: 'بنية حديثة وقابلة للتوسع',
      frontend: ['Next.js 14', 'React 18', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'MapLibre GL'],
      backend: ['واجهات Next.js API', 'Prisma ORM', 'SQLite / PostgreSQL', 'JWT (jose)', 'bcryptjs'],
      devops: ['Docker', 'Render Cloud', 'Vercel', 'Git', 'أنابيب CI/CD'],
      integrations: ['MapLibre GL JS', 'Sonner Toasts', 'shadcn/ui', 'next-themes'],
    },
  },
  {
    id: 'dashboard',
    en: {
      title: 'Command Center Dashboards',
      subtitle: 'Real-time operational awareness at a glance',
      screens: [
        { name: 'Main Dashboard', desc: 'System health, active trains, alerts summary, passenger stats' },
        { name: 'Live Map View', desc: 'Real-time train positions, station status, animated routes' },
        { name: 'Analytics Suite', desc: 'Passenger flow, delay analysis, line distribution, predictions' },
        { name: 'Incidents & Alerts', desc: 'Centralized alert management with acknowledgment workflow' },
        { name: 'Fleet Control', desc: 'Train status, maintenance schedules, capacity utilization' },
        { name: 'Settings & Admin', desc: 'System configuration, user management, audit logs' },
      ],
    },
    ar: {
      title: 'لوحات مركز القيادة',
      subtitle: 'الوعي التشغيلي الفوري في لمحة',
      screens: [
        { name: 'لوحة التحكم الرئيسية', desc: 'صحة النظام، القطارات النشطة، ملخص التنبيهات، إحصائيات الركاب' },
        { name: 'عرض الخريطة الحية', desc: 'مواقع القطارات فورياً، حالة المحطات، مسارات متحركة' },
        { name: 'مجموعة التحليلات', desc: 'تدفق الركاب، تحليل التأخير، توزيع الخطوط، التوقعات' },
        { name: 'البلاغات والتنبيهات', desc: 'إدارة مركزية للتنبيهات مع سير عمل الإقرار' },
        { name: 'التحكم بالأسطول', desc: 'حالة القطارات، جداول الصيانة، استغلال السعة' },
        { name: 'الإعدادات والإدارة', desc: 'تكوين النظام، إدارة المستخدمين، سجلات التدقيق' },
      ],
    },
  },
  {
    id: 'deployment',
    en: {
      title: 'Cloud Deployment',
      subtitle: 'Resilient infrastructure for 24/7 operations',
      stats: [
        { value: '99.9%', label: 'Uptime SLA' },
        { value: '<500ms', label: 'Avg Response Time' },
        { value: 'Auto', label: 'Scaling' },
        { value: '55+', label: 'Pages Generated' },
      ],
      platforms: [
        { name: 'Render', desc: 'Primary hosting, auto-deploy from Git, built-in SSL' },
        { name: 'Vercel', desc: 'Alternative deployment with edge network' },
        { name: 'Docker', desc: 'Containerized for consistent environments' },
        { name: 'SQLite', desc: 'Zero-config database, easy migration path to PostgreSQL' },
      ],
    },
    ar: {
      title: 'النشر السحابي',
      subtitle: 'بنية تحتية مرنة للعمليات على مدار الساعة',
      stats: [
        { value: '٩٩.٩٪', label: 'ضمان وقت التشغيل' },
        { value: 'أقل من ٥٠٠ مللي', label: 'متوسط وقت الاستجابة' },
        { value: 'تلقائي', label: 'التوسع' },
        { value: '٥٥+', label: 'صفحة مولدة' },
      ],
      platforms: [
        { name: 'Render', desc: 'استضافة أساسية، نشر تلقائي من Git، SSL مدمج' },
        { name: 'Vercel', desc: 'نشر بديل مع شبكة الحافة' },
        { name: 'Docker', desc: 'حاويات لبيئات متسقة' },
        { name: 'SQLite', desc: 'قاعدة بيانات بدون إعداد، مسار ترقية سهل إلى PostgreSQL' },
      ],
    },
  },
  {
    id: 'closing',
    en: {
      title: 'TrainEye AI',
      subtitle: 'Transforming Riyadh Metro Operations',
      message: 'Built with cutting-edge technology to deliver safer, more efficient, and smarter metro services for the capital city of Saudi Arabia.',
      cta: 'Experience the Future of Metro Operations',
      stats: [
        { value: '6', label: 'Metro Lines' },
        { value: '94', label: 'Stations' },
        { value: '42', label: 'Trains' },
        { value: '11', label: 'User Roles' },
      ],
    },
    ar: {
      title: 'ذكاء القطار',
      subtitle: 'تحويل عمليات مترو الرياض',
      message: 'بُني بأحدث التقنيات لتقديم خدمات مترو أكثر أماناً وكفاءة وذكاءً لعاصمة المملكة العربية السعودية.',
      cta: 'اختبر مستقبل عمليات المترو',
      stats: [
        { value: '٦', label: 'خطوط المترو' },
        { value: '٩٤', label: 'محطة' },
        { value: '٤٢', label: 'قطار' },
        { value: '١١', label: 'نوع مستخدم' },
      ],
    },
  },
]

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1200 : -1200,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 1200 : -1200,
    opacity: 0,
  }),
}

export default function PresentationPage() {
  const [[slideIndex, direction], setSlideState] = useState([0, 0])
  const [isAr, setIsAr] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const slide = slides[slideIndex]
  const total = slides.length

  const goTo = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(index, total - 1))
    setSlideState(([prev]) => [clamped, clamped > prev ? 1 : -1])
  }, [total])

  const next = useCallback(() => goTo(slideIndex + 1), [goTo, slideIndex])
  const prev = useCallback(() => goTo(slideIndex - 1), [goTo, slideIndex])

  useEffect(() => {
    if (isPaused) return
    timerRef.current = setInterval(() => {
      setSlideState(([current]) => {
        const nextIdx = current + 1 >= total ? 0 : current + 1
        return [nextIdx, 1]
      })
    }, 7000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [total, isPaused])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === ' ') { e.preventDefault(); setIsPaused((p) => !p) }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [next, prev])

  const t = isAr ? 'ar' : 'en'

  return (
    <div className="fixed inset-0 bg-[#060b18] overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#06b6d4] to-[#2563eb] flex items-center justify-center">
            <span className="text-black text-sm font-black">T</span>
          </div>
          <span className="text-white font-bold text-sm hidden sm:inline">TrainEye AI</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAr(!isAr)}
            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white transition-colors"
          >
            {isAr ? 'English' : 'العربية'}
          </button>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs text-gray-400 hover:text-white transition-colors"
          >
            {isPaused ? '▶' : '⏸'}
          </button>
          <span className="text-xs text-gray-500 font-mono">
            {String(slideIndex + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Slides */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={slideIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'spring', stiffness: 280, damping: 30 }}
          className="absolute inset-0"
        >
          <SlideContent slide={slide} t={t} isAr={isAr} />
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all backdrop-blur-sm"
        style={{ [isAr ? 'right' : 'left']: '24px' }}
      >
        {isAr ? '→' : '←'}
      </button>
      <button
        onClick={next}
        className="absolute top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all backdrop-blur-sm"
        style={{ [isAr ? 'left' : 'right']: '24px' }}
      >
        {isAr ? '←' : '→'}
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === slideIndex
                ? 'w-8 bg-gradient-to-r from-[#06b6d4] to-[#2563eb]'
                : 'w-1.5 bg-white/20 hover:bg-white/40'
            }`}
          />
        ))}
      </div>

      {/* Pause overlay */}
      {isPaused && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs">
          {isAr ? '⏸ تم الإيقاف المؤقت - اضغط مسافة للاستئناف' : '⏸ Paused - Press Space to resume'}
        </div>
      )}
    </div>
  )
}

function SlideContent({ slide, t, isAr }: { slide: (typeof slides)[number]; t: 'ar' | 'en'; isAr: boolean }) {
  const content = slide[t] as any

  if (slide.id === 'title') {
    const c = content as { title: string; subtitle: string; tagline: string }
    return (
      <div className="h-full flex flex-col items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }} className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-[#06b6d4] to-[#2563eb] mb-8 shadow-2xl shadow-[#06b6d4]/20">
            <span className="text-black text-4xl font-black">T</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight">
            {c.title}
          </h1>
          <p className="text-xl md:text-2xl text-[#06b6d4] font-semibold mb-3">
            {c.subtitle}
          </p>
          <p className="text-sm md:text-base text-gray-500 max-w-xl mx-auto leading-relaxed">
            {c.tagline}
          </p>
          <div className="mt-12 flex items-center justify-center gap-2 text-gray-600 text-xs">
            <span className="w-2 h-2 rounded-full bg-[#06b6d4] animate-pulse" />
            {t === 'ar' ? 'تمرير تلقائي' : 'Auto-advancing'}
          </div>
        </motion.div>
      </div>
    )
  }

  if (slide.id === 'overview') {
    const c = content as { title: string; subtitle: string; items: string[] }
    return (
      <div className="h-full flex flex-col items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="text-center max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-2">{c.title}</h2>
          <p className="text-gray-400 mb-10">{c.subtitle}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {c.items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.4 }}
                className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 hover:bg-white/[0.06] transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#06b6d4]/20 to-[#2563eb]/20 flex items-center justify-center mb-3">
                  <div className="w-2 h-2 rounded-full bg-[#06b6d4]" />
                </div>
                <p className="text-sm text-white/80 leading-relaxed">{item}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    )
  }

  if (slide.id === 'features') {
    const c = content as { title: string; subtitle: string; features: { icon: string; name: string; desc: string }[] }
    return (
      <div className="h-full flex flex-col items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="text-center max-w-5xl">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-2">{c.title}</h2>
          <p className="text-gray-400 mb-8">{c.subtitle}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {c.features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.4 }}
                className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 hover:bg-white/[0.06] transition-colors text-center"
              >
                <span className="text-2xl mb-2 block">{f.icon}</span>
                <h4 className="text-sm font-bold text-white mb-1">{f.name}</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    )
  }

  if (slide.id === 'map') {
    const c = content as { title: string; subtitle: string; lines: { name: string; color: string; stations: number; desc: string }[] }
    return (
      <div className="h-full flex flex-col items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="text-center max-w-4xl">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-2">{c.title}</h2>
          <p className="text-gray-400 mb-8">{c.subtitle}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {c.lines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i, duration: 0.4 }}
                className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 text-right"
                style={{ borderRightColor: line.color, borderRightWidth: 3 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: line.color }} />
                  <h4 className="text-sm font-bold text-white">{line.name}</h4>
                </div>
                <p className="text-xs text-gray-400 mb-1">{line.stations} {t === 'ar' ? 'محطة' : 'stations'}</p>
                <p className="text-[11px] text-gray-500">{line.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    )
  }

  if (slide.id === 'analytics') {
    const c = content as {
      title: string; subtitle: string
      metrics: { value: string; label: string; desc: string }[]
      features: string[]
    }
    return (
      <div className="h-full flex flex-col items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-2">{c.title}</h2>
            <p className="text-gray-400">{c.subtitle}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {c.metrics.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * i, duration: 0.4 }}
                className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 text-center"
              >
                <p className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#06b6d4] to-[#2563eb]">
                  {m.value}
                </p>
                <p className="text-sm font-bold text-white mt-1">{m.label}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{m.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 max-w-2xl mx-auto">
            <ul className="space-y-2">
              {c.features.map((f, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.3 }}
                  className="flex items-center gap-3 text-sm text-gray-400"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#06b6d4] shrink-0" />
                  {f}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    )
  }

  if (slide.id === 'security') {
    const c = content as {
      title: string; subtitle: string
      layers: { name: string; desc: string }[]
    }
    return (
      <div className="h-full flex flex-col items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="text-center max-w-5xl">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-2">{c.title}</h2>
          <p className="text-gray-400 mb-8">{c.subtitle}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {c.layers.map((layer, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i, duration: 0.4 }}
                className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 text-center hover:border-[#06b6d4]/20 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#06b6d4]/10 to-[#2563eb]/10 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-5 h-5 text-[#06b6d4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">{layer.name}</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">{layer.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    )
  }

  if (slide.id === 'tech') {
    const c = content as {
      title: string; subtitle: string
      frontend: string[]; backend: string[]; devops: string[]; integrations: string[]
    }
    return (
      <div className="h-full flex flex-col items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="max-w-5xl w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-2">{c.title}</h2>
            <p className="text-gray-400">{c.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: t === 'ar' ? 'الواجهة الأمامية' : 'Frontend', items: c.frontend, gradient: 'from-[#06b6d4]/10 to-[#2563eb]/10', border: 'border-[#06b6d4]/20' },
              { title: t === 'ar' ? 'الخادم الخلفي' : 'Backend', items: c.backend, gradient: 'from-[#9333ea]/10 to-[#06b6d4]/10', border: 'border-[#9333ea]/20' },
              { title: 'DevOps', items: c.devops, gradient: 'from-[#f97316]/10 to-[#eab308]/10', border: 'border-[#f97316]/20' },
              { title: t === 'ar' ? 'تكاملات' : 'Integrations', items: c.integrations, grid: true, gradient: 'from-[#22c55e]/10 to-[#06b6d4]/10', border: 'border-[#22c55e]/20' },
            ].map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.4 }}
                className={`bg-white/[0.03] border ${cat.border} rounded-2xl p-4 ${cat.grid ? 'md:col-span-3' : ''}`}
              >
                <h4 className="text-sm font-bold text-white mb-3">{cat.title}</h4>
                <div className={`flex ${cat.grid ? 'flex-wrap' : 'flex-col'} gap-2`}>
                  {(cat.items as string[]).map((item, j) => (
                    <span
                      key={j}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/[0.06] text-xs text-gray-400 ${cat.grid ? '' : ''}`}
                    >
                      <span className="w-1 h-1 rounded-full bg-current opacity-40" />
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    )
  }

  if (slide.id === 'dashboard') {
    const c = content as {
      title: string; subtitle: string
      screens: { name: string; desc: string }[]
    }
    return (
      <div className="h-full flex flex-col items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="text-center max-w-5xl">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-2">{c.title}</h2>
          <p className="text-gray-400 mb-8">{c.subtitle}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {c.screens.map((screen, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 * i, duration: 0.4 }}
                className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 text-center hover:border-white/10 transition-colors"
              >
                <div className="w-10 h-7 rounded-lg bg-gradient-to-br from-gray-600/20 to-gray-400/10 border border-white/[0.06] mx-auto mb-3 flex items-center justify-center">
                  <div className="w-3 h-2 rounded-sm bg-[#06b6d4]/30" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">{screen.name}</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">{screen.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    )
  }

  if (slide.id === 'deployment') {
    const c = content as {
      title: string; subtitle: string
      stats: { value: string; label: string }[]
      platforms: { name: string; desc: string }[]
    }
    return (
      <div className="h-full flex flex-col items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-2">{c.title}</h2>
            <p className="text-gray-400">{c.subtitle}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {c.stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i, duration: 0.4 }}
                className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 text-center"
              >
                <p className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#06b6d4] to-[#2563eb]">
                  {s.value}
                </p>
                <p className="text-xs text-gray-400 mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {c.platforms.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i, duration: 0.4 }}
                className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 text-center"
              >
                <h4 className="text-sm font-bold text-white mb-1">{p.name}</h4>
                <p className="text-[11px] text-gray-500">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    )
  }

  if (slide.id === 'closing') {
    const c = content as {
      title: string; subtitle: string; message: string; cta: string
      stats: { value: string; label: string }[]
    }
    return (
      <div className="h-full flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-center max-w-3xl"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#06b6d4] to-[#2563eb] mb-6 shadow-2xl shadow-[#06b6d4]/20">
            <span className="text-black text-3xl font-black">T</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-2">{c.title}</h2>
          <p className="text-lg text-[#06b6d4] font-semibold mb-4">{c.subtitle}</p>
          <p className="text-sm text-gray-500 max-w-xl mx-auto leading-relaxed mb-8">
            {c.message}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {c.stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * i, duration: 0.4 }}
                className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-3"
              >
                <p className="text-lg md:text-2xl font-black text-white">{s.value}</p>
                <p className="text-[10px] text-gray-500">{s.label}</p>
              </motion.div>
            ))}
          </div>
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#06b6d4] to-[#2563eb] text-white text-sm font-bold shadow-lg shadow-[#06b6d4]/20">
            {c.cta}
            <span>{isAr ? '→' : '→'}</span>
          </div>
        </motion.div>
      </div>
    )
  }

  return null
}
