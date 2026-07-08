export interface Detection {
  id?: number;
  discovered_by: string | null;
  first_reporter: string | null;
  emergency_code: string | null;
  permit_number: string | null;
  detection_time: string | null;
  occ_notification_time: string | null;
  occ_response_time: string | null;
}

export interface IncidentType {
  id?: number;
  type_name: string;
}

export interface Passenger {
  id?: number;
  name: string | null;
  age: number | null;
  phone: string | null;
  emergency_contact: string | null;
  passenger_status: string | null;
  hospital_name: string | null;
  ambulance_ref: string | null;
  first_aid_given: string | null;
  ambulance_request_time: string | null;
  ambulance_arrival_time: string | null;
  handover_time: string | null;
  departure_time: string | null;
}

export interface TrainOperation {
  id?: number;
  train_number: string | null;
  current_location: string | null;
  destination: string | null;
  operation_mode: string | null;
  rescue_train_number: string | null;
  rescue_start_time: string | null;
  rescue_end_time: string | null;
  handover_to_occ_time: string | null;
  return_to_service_time: string | null;
}

export interface StationEvacuation {
  id?: number;
  evacuation_order_time: string | null;
  evacuation_start_time: string | null;
  evacuation_completion_time: string | null;
  station_clear_notification_time: string | null;
  station_reopening_time: string | null;
}

export interface StaffMember {
  id?: number;
  name: string | null;
  employee_id: string | null;
  role: string | null;
  notes: string | null;
  digital_signature: string | null;
}

export interface ImpactAssessment {
  id?: number;
  incident_duration: number | null;
  response_duration: number | null;
  evacuation_duration: number | null;
  rescue_duration: number | null;
  train_delays: number | null;
  passengers_affected: number | null;
  injuries: number | null;
  fatalities: number | null;
  equipment_affected: string | null;
  cause: string | null;
  corrective_actions: string | null;
  lessons_learned: string | null;
  incident_closed: boolean | null;
  closed_at: string | null;
}

export interface Incident {
  id: number;
  incident_number: string;
  date: string | null;
  day: string | null;
  time: string | null;
  shift: string | null;
  station: string | null;
  location: string | null;
  platform_track: string | null;
  description: string | null;
  created_by_name: string | null;
  created_by_employee_id: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface IncidentListItem extends Incident {
  incident_types: IncidentType[];
}

export interface IncidentDetail extends Incident {
  detection: Detection | null;
  incident_types: IncidentType[];
  passengers: Passenger[];
  train_operations: TrainOperation | null;
  evacuation: StationEvacuation | null;
  staff: StaffMember[];
  impact: ImpactAssessment | null;
}

export interface KPIResponse {
  total_incidents: number;
  open_incidents: number;
  closed_incidents: number;
  total_injuries: number;
  total_fatalities: number;
  avg_response_time: number | null;
  avg_evacuation_time: number | null;
  incidents_by_station: Record<string, number>;
  incidents_by_type: Record<string, number>;
  monthly_trend: { month: string; count: number }[];
}

export interface Station {
  name: string;
  line: "blue" | "red";
}

export const STATIONS: Station[] = [
  { name: "Station 1", line: "blue" },
  { name: "Station 2", line: "blue" },
  { name: "Station 3", line: "blue" },
  { name: "Station 4", line: "blue" },
  { name: "Station 5", line: "blue" },
  { name: "Station 6", line: "blue" },
  { name: "Station 7", line: "blue" },
  { name: "Station 8", line: "blue" },
  { name: "Station 9", line: "blue" },
  { name: "Station 10", line: "blue" },
  { name: "Station 11", line: "blue" },
  { name: "Station 12", line: "blue" },
  { name: "Station 13", line: "blue" },
  { name: "Station 14", line: "blue" },
  { name: "Station 15", line: "blue" },
  { name: "Station 16", line: "blue" },
  { name: "Station 17", line: "blue" },
  { name: "Station 18", line: "blue" },
  { name: "Station 19", line: "blue" },
  { name: "Station 20", line: "blue" },
  { name: "Station 21", line: "blue" },
  { name: "Station 22", line: "blue" },
  { name: "Station 23", line: "blue" },
  { name: "Station 24", line: "blue" },
  { name: "Station 25", line: "blue" },
  { name: "Station 26", line: "red" },
  { name: "Station 27", line: "red" },
  { name: "Station 28", line: "red" },
  { name: "Station 29", line: "red" },
  { name: "Station 30", line: "red" },
  { name: "Station 31", line: "red" },
  { name: "Station 32", line: "red" },
  { name: "Station 33", line: "red" },
  { name: "Station 34", line: "red" },
  { name: "Station 35", line: "red" },
  { name: "Station 36", line: "red" },
  { name: "Station 37", line: "red" },
  { name: "Station 38", line: "red" },
  { name: "Station 39", line: "red" },
  { name: "Station 40", line: "red" },
];

export const SHIFTS = ["Morning", "Evening", "Night"];

export const LOCATION_OPTIONS = [
  "Platform",
  "Concourse",
  "Street Level",
  "Track",
  "Equipment Room",
];

export const DISCOVERED_BY_OPTIONS = [
  "OCC",
  "Station Manager (SM)",
  "Assistant SM (ASM)",
  "Station Ambassador (SA)",
  "Security",
  "Maintenance",
  "Cleaner",
  "Passenger",
  "Police",
  "Civil Defense",
  "Other",
];

export const TRAIN_MODES = ["UTO", "ATPM", "RM", "DM"];

export const INCIDENT_TYPES = [
  "Medical Emergency",
  "Fire",
  "Security Threat",
  "Power Failure",
  "Signal Failure",
  "Track Intrusion",
  "Platform Incident",
  "Train Breakdown",
  "Door Malfunction",
  "HVAC Failure",
  "Water Leak",
  "Structural Damage",
  "Electrical Fault",
  "Communication Failure",
  "Evacuation",
  "Bomb Threat",
  "Suspicious Package",
  "Assault",
  "Theft",
  "Vandalism",
  "Smoke Detection",
  "Gas Leak",
  "Flooding",
  "Escalator / Elevator Failure",
  "Crowd Management",
  "Other",
];

export const STAFF_ROLES = [
  "Station Manager (SM)",
  "Assistant Station Manager (ASM)",
  "Station Ambassador (SA)",
  "Security",
  "Maintenance",
  "First Responder",
  "Police",
  "Civil Defense",
];
