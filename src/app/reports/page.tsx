'use client'

import { useState } from 'react'
import { FileText, Download, FileSpreadsheet, FileDown, Clock, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import PageHeader from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

interface ReportConfig {
  type: string
  dateFrom: string
  dateTo: string
  line: string
}

const reportTypes = [
  { id: 'daily', label: 'ملخص يومي' },
  { id: 'line', label: 'أداء الخطوط' },
  { id: 'passenger', label: 'تحليل الركاب' },
  { id: 'maintenance', label: 'تقرير الصيانة' },
  { id: 'fleet', label: 'حالة الأسطول' },
]

interface GeneratedReport {
  id: string
  type: string
  date: string
  time: string
  status: string
}

export default function ReportsPage() {
  const [config, setConfig] = useState<ReportConfig>({
    type: 'daily',
    dateFrom: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
    dateTo: new Date().toISOString().split('T')[0],
    line: 'all',
  })
  const [generating, setGenerating] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [recentReports, setRecentReports] = useState<GeneratedReport[]>([
    { id: '1', type: 'daily', date: new Date(Date.now() - 86400000).toISOString().split('T')[0], time: '08:00', status: 'مكتمل' },
    { id: '2', type: 'line', date: new Date(Date.now() - 172800000).toISOString().split('T')[0], time: '09:15', status: 'مكتمل' },
    { id: '3', type: 'passenger', date: new Date(Date.now() - 259200000).toISOString().split('T')[0], time: '14:30', status: 'مكتمل' },
  ])

  async function handleGenerate() {
    setGenerating(true)
    await new Promise(r => setTimeout(r, 2000))
    const newReport: GeneratedReport = {
      id: Date.now().toString(),
      type: config.type,
      date: config.dateTo,
      time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      status: 'مكتمل',
    }
    setRecentReports(prev => [newReport, ...prev])
    setGenerating(false)
    setShowPreview(true)
  }

  const previewData = {
    daily: {
      title: 'ملخص يومي - ' + config.dateTo,
      stats: [
        ['إجمالي الرحلات', '156'],
        ['الرحلات المكتملة', '142'],
        ['الرحلات المتأخرة', '8'],
        ['إجمالي الركاب', '45,230'],
        ['متوسط التأخير', '3.2 دقيقة'],
        ['نسبة الأداء', '91%'],
      ],
    },
    line: {
      title: 'تقرير أداء الخطوط - ' + config.dateTo,
      stats: [
        ['الخط الأزرق', '98% أداء - 23 رحلة'],
        ['الخط الأخضر', '95% أداء - 31 رحلة'],
        ['الخط البرتقالي', '87% أداء - 28 رحلة'],
        ['الخط الأحمر', '92% أداء - 19 رحلة'],
        ['الخط البنفسجي', '96% أداء - 25 رحلة'],
      ],
    },
    passenger: {
      title: 'تحليل الركاب - ' + config.dateTo,
      stats: [
        ['إجمالي الركاب', '45,230'],
        ['ذروة الصباح (7-9)', '12,400 راكب'],
        ['ذروة المساء (4-7)', '15,800 راكب'],
        ['أكثر محطة ازدحاما', 'محطة الملك عبدالله'],
        ['متوسط وقت الانتظار', '4.5 دقيقة'],
      ],
    },
    maintenance: {
      title: 'تقرير الصيانة - ' + config.dateTo,
      stats: [
        ['عمليات الصيانة المكتملة', '12'],
        ['صيانة وقائية', '8'],
        ['إصلاحات طارئة', '4'],
        ['قطارات في الصيانة', '3'],
        ['متوسط مدة الصيانة', '3.5 ساعات'],
      ],
    },
    fleet: {
      title: 'حالة الأسطول - ' + config.dateTo,
      stats: [
        ['إجمالي القطارات', '120'],
        ['القطارات النشطة', '95'],
        ['في الصيانة', '15'],
        ['متاحة للخدمة', '110'],
        ['استغلال الأسطول', '79%'],
      ],
    },
  }

  const currentPreview = previewData[config.type as keyof typeof previewData]

  return (
    <div className="space-y-6">
      <PageHeader title="التقارير" description="إنشاء وعرض تقارير الشبكة" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card className="p-4 space-y-4">
            <h3 className="text-sm font-medium text-white">إعدادات التقرير</h3>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">نوع التقرير</label>
              <Select value={config.type} onValueChange={(v) => setConfig({ ...config, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {reportTypes.map(rt => (
                    <SelectItem key={rt.id} value={rt.id}>{rt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">من تاريخ</label>
              <Input type="date" value={config.dateFrom} onChange={(e) => setConfig({ ...config, dateFrom: e.target.value })} />
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">إلى تاريخ</label>
              <Input type="date" value={config.dateTo} onChange={(e) => setConfig({ ...config, dateTo: e.target.value })} />
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">الخط</label>
              <Select value={config.line} onValueChange={(v) => setConfig({ ...config, line: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الخطوط</SelectItem>
                  <SelectItem value="blue">الخط الأزرق</SelectItem>
                  <SelectItem value="green">الخط الأخضر</SelectItem>
                  <SelectItem value="orange">الخط البرتقالي</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full" onClick={handleGenerate} disabled={generating}>
              {generating ? (
                <><RefreshCw className="h-4 w-4 ml-2 animate-spin" /> جاري الإنشاء...</>
              ) : (
                <><FileText className="h-4 w-4 ml-2" /> إنشاء التقرير</>
              )}
            </Button>
          </Card>

          <Card className="p-4 space-y-3">
            <h3 className="text-sm font-medium text-white">التقارير الأخيرة</h3>
            {recentReports.map(report => (
              <div key={report.id} className="flex items-center justify-between p-2 rounded-lg bg-t-panel/50 hover:bg-t-panel transition-colors cursor-pointer"
                onClick={() => setShowPreview(true)}>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-t-cyan" />
                  <div>
                    <p className="text-xs text-white">{reportTypes.find(r => r.id === report.type)?.label}</p>
                    <p className="text-[10px] text-gray-500">{report.date} - {report.time}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-[10px]">{report.status}</Badge>
              </div>
            ))}
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="min-h-[600px]">
            <CardHeader className="flex flex-row items-center justify-between border-b border-t-border">
              <CardTitle className="text-sm">معاينة التقرير</CardTitle>
              {showPreview && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <FileDown className="h-3.5 w-3.5 ml-1" /> PDF
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileSpreadsheet className="h-3.5 w-3.5 ml-1" /> Excel
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-3.5 w-3.5 ml-1" /> CSV
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="p-6">
              {!showPreview ? (
                <div className="flex flex-col items-center justify-center h-[400px] text-gray-500">
                  <FileText className="h-12 w-12 mb-3 opacity-30" />
                  <p className="text-sm">اختر الإعدادات وأنشئ تقريراً لمعاينته هنا</p>
                </div>
              ) : generating ? (
                <div className="space-y-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex justify-between"><Skeleton className="h-4 w-32" /><Skeleton className="h-4 w-20" /></div>
                  ))}
                </div>
              ) : (
                <div className="bg-white/5 rounded-lg p-6 border border-t-border/30">
                  <div className="text-center mb-6 border-b border-t-border/30 pb-4">
                    <h2 className="text-lg font-bold text-white">{currentPreview.title}</h2>
                    <p className="text-xs text-gray-400 mt-1">TrainEye AI - مركز إدارة مترو الرياض</p>
                  </div>
                  <table className="w-full">
                    <tbody>
                      {currentPreview.stats.map(([label, value], i) => (
                        <tr key={i} className="border-b border-t-border/20">
                          <td className="py-3 text-sm text-gray-300">{label}</td>
                          <td className="py-3 text-sm font-medium text-white text-left">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-6 pt-4 border-t border-t-border/30 text-center">
                    <p className="text-[10px] text-gray-500">
                      <Clock className="h-3 w-3 inline ml-1" />
                      تم الإنشاء: {new Date().toLocaleString('ar-SA')}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
