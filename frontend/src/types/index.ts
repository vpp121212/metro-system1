export type LineKey = "blue" | "red" | "orange" | "yellow" | "green" | "purple";

export type TabKey = "dashboard" | "map" | "cameras" | "analytics" | "alerts" | "simulation" | "reports" | "settings";

export type AlertType = "critical" | "warning" | "info";

export type CameraStatus = "active" | "warning" | "offline";

export type LineStatus = "normal" | "delayed" | "issue";

export interface LineData {
  name: string;
  nameEn: string;
  color: string;
  stations: string[];
  interchange: number[];
}

export interface Alert {
  id: number;
  type: AlertType;
  title: string;
  desc: string;
  time: string;
  line: LineKey | "all";
  acknowledged: boolean;
}

export interface KpiData {
  trains: number;
  passengers: number;
  delay: number;
  safety: number;
}

export interface Camera {
  line: LineKey;
  station: string;
  status: CameraStatus;
  id: string;
}

export interface Notification {
  id: number;
  title: string;
  desc: string;
  time: string;
  read: boolean;
}

export interface SimulationScenario {
  type: string;
  title: string;
  color: string;
  description: string;
}

export interface SimulationStep {
  msg: string;
  step: string;
  delay: number;
}

export interface StationDensity {
  name: string;
  density: number;
}

export interface SavedReport {
  name: string;
  format: string;
  size: string;
}

export interface Settings {
  darkMode: boolean;
  soundNotifications: boolean;
  autoRefresh: boolean;
  delayAlerts: boolean;
  crowdAlerts: boolean;
}
