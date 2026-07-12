import { useState, useCallback, useRef } from "react";
import type { Alert, LineKey } from "../types";
import { initialAlerts, linesData, randomAlertType, randomStation } from "../utils/simulation";

export function useSimulation() {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [isSimRunning, setIsSimRunning] = useState(false);
  const [simTitle, setSimTitle] = useState("اختر سيناريو للبدء");
  const [simSteps, setSimSteps] = useState<Record<string, boolean>>({});
  const [simComplete, setSimComplete] = useState(false);
  const [simLog, setSimLog] = useState<string[]>([]);
  const [showSimControls, setShowSimControls] = useState(false);
  const [showSimLog, setShowSimLog] = useState(false);
  const timersRef = useRef<number[]>([]);

  const acknowledgeAlert = useCallback((id: number) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    );
  }, []);

  const clearAllAlerts = useCallback(() => {
    setAlerts((prev) => prev.map((a) => ({ ...a, acknowledged: true })));
  }, []);

  const addAlert = useCallback((alert: Alert) => {
    setAlerts((prev) => {
      const next = [alert, ...prev];
      return next.length > 20 ? next.slice(0, 20) : next;
    });
  }, []);

  const startScenario = useCallback(
    (type: string, title: string, color: string) => {
      void type;
      void color;
      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current = [];

      setIsSimRunning(true);
      setSimTitle(title);
      setSimSteps({});
      setSimComplete(false);
      setSimLog([]);
      setShowSimControls(true);
      setShowSimLog(true);

      const steps = ["step1", "step2", "step3", "step4"];
      const msgs = [
        "تم تهيئة السيناريو بنجاح",
        "تحليل التأثير على الخطوط المجاورة",
        "تفعيل بروتوكول الاستجابة",
        "المراقبة المستمرة للوضع",
      ];
      const delays = [1000, 2500, 4000, 5500];

      steps.forEach((step, i) => {
        const timer = window.setTimeout(() => {
          setSimLog((prev) => [...prev, `[${new Date().toLocaleTimeString("ar-SA")}] ${msgs[i]!}`]);
          setSimSteps((prev) => ({ ...prev, [step]: true }));
          if (i === steps.length - 1) {
            setSimComplete(true);
            setIsSimRunning(false);
          }
        }, delays[i]!);
        timersRef.current.push(timer);
      });
    },
    []
  );

  const pauseSimulation = useCallback(() => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
    setIsSimRunning(false);
    setSimTitle((prev) => prev + " (متوقف)");
  }, []);

  const stopSimulation = useCallback(() => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
    setIsSimRunning(false);
    setSimTitle("اختر سيناريو للبدء");
    setSimSteps({});
    setSimComplete(false);
    setSimLog([]);
    setShowSimControls(false);
    setShowSimLog(false);
  }, []);

  const getActiveAlertCount = useCallback(() => {
    return alerts.filter((a) => !a.acknowledged).length;
  }, [alerts]);

  const getAlertStats = useCallback(() => {
    const critical = alerts.filter((a) => a.type === "critical" && !a.acknowledged).length;
    const warning = alerts.filter((a) => a.type === "warning" && !a.acknowledged).length;
    const info = alerts.filter((a) => a.type === "info" && !a.acknowledged).length;
    const resolved = alerts.filter((a) => a.acknowledged).length;
    return { critical, warning, info, resolved };
  }, [alerts]);

  const generateRandomAlert = useCallback(() => {
    const type = randomAlertType();
    const lineKeys = Object.keys(linesData) as LineKey[];
    const line = lineKeys[Math.floor(Math.random() * lineKeys.length)]!;
    const station = randomStation(line);
    const alert: Alert = {
      id: Date.now(),
      type,
      title: type === "warning" ? "ازدحام مرتفع" : "تحديث",
      desc:
        type === "warning"
          ? `كثافة ركاب مرتفعة في محطة ${station}`
          : `تحديث بيانات محطة ${station}`,
      time: "الآن",
      line,
      acknowledged: false,
    };
    addAlert(alert);
    return alert;
  }, [addAlert]);

  return {
    alerts,
    isSimRunning,
    simTitle,
    simSteps,
    simComplete,
    simLog,
    showSimControls,
    showSimLog,
    acknowledgeAlert,
    clearAllAlerts,
    addAlert,
    startScenario,
    pauseSimulation,
    stopSimulation,
    getActiveAlertCount,
    getAlertStats,
    generateRandomAlert,
  };
}
