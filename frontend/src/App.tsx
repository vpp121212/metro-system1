import { useState, useEffect, useCallback } from "react";
import { Box } from "@mui/material";
import Sidebar from "./components/Layout/Sidebar";
import Header from "./components/Layout/Header";
import DashboardTab from "./components/Dashboard/DashboardTab";
import MapTab from "./components/Map/MapTab";
import CamerasTab from "./components/Cameras/CamerasTab";
import AnalyticsTab from "./components/Analytics/AnalyticsTab";
import AlertsTab from "./components/Alerts/AlertsTab";
import SimulationTab from "./components/Simulation/SimulationTab";
import ReportsTab from "./components/Reports/ReportsTab";
import SettingsTab from "./components/Settings/SettingsTab";
import Toast from "./components/Common/Toast";
import { useSimulation } from "./hooks/useSimulation";
import { formatUptime } from "./utils/formatters";
import { generateCameras } from "./utils/simulation";
import type { TabKey, AlertType } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>("dashboard");
  const [showNotifications, setShowNotifications] = useState(false);
  const [toasts, setToasts] = useState<{ id: number; title: string; msg: string; type: AlertType }[]>([]);
  const [uptime, setUptime] = useState(0);
  const [health, setHealth] = useState(98.7);
  const [cameraCount] = useState(() => generateCameras().length);

  const {
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
    startScenario,
    pauseSimulation,
    stopSimulation,
    getActiveAlertCount,
    getAlertStats,
    generateRandomAlert,
  } = useSimulation();

  useEffect(() => {
    const interval = setInterval(() => {
      setUptime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHealth(parseFloat((98 + Math.random() * 1.5).toFixed(1)));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.95) {
        const alert = generateRandomAlert();
        setToasts((prev) => [
          ...prev.slice(-4),
          { id: Date.now(), title: alert.title, msg: alert.desc, type: alert.type },
        ]);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [generateRandomAlert]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const alertCount = getActiveAlertCount();
  const alertStats = getAlertStats();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: "#060b18", color: "#e2e8f0" }}>
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        alertCount={alertCount}
        cameraCount={cameraCount}
        health={health}
        uptime={formatUptime(uptime)}
      />

      <Box component="main" sx={{ flex: 1, mr: { md: "240px" }, minHeight: "100vh" }}>
        <Header
          pageTitle={activeTab}
          alertCount={alertCount}
          onNotifications={() => setShowNotifications(!showNotifications)}
          showNotifications={showNotifications}
          onClearNotifications={clearAllAlerts}
          alerts={alerts}
          onAlertClick={(id) => {
            acknowledgeAlert(id);
            setShowNotifications(false);
          }}
        />

        <Box sx={{ p: 2.5 }}>
          {activeTab === "dashboard" && <DashboardTab alerts={alerts} onSwitchTab={(tab) => setActiveTab(tab as TabKey)} />}
          {activeTab === "map" && <MapTab />}
          {activeTab === "cameras" && <CamerasTab />}
          {activeTab === "analytics" && <AnalyticsTab />}
          {activeTab === "alerts" && <AlertsTab alerts={alerts} onAcknowledge={acknowledgeAlert} alertStats={alertStats} />}
          {activeTab === "simulation" && (
            <SimulationTab
              simTitle={simTitle}
              simSteps={simSteps}
              simComplete={simComplete}
              simLog={simLog}
              showControls={showSimControls}
              showLog={showSimLog}
              isRunning={isSimRunning}
              onStartScenario={startScenario}
              onPause={pauseSimulation}
              onStop={stopSimulation}
            />
          )}
          {activeTab === "reports" && <ReportsTab />}
          {activeTab === "settings" && <SettingsTab />}
        </Box>
      </Box>

      {toasts.map((toast) => (
        <Toast key={toast.id} title={toast.title} msg={toast.msg} type={toast.type} onDone={() => removeToast(toast.id)} />
      ))}
    </Box>
  );
}
