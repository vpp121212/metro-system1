import { useParams, useNavigate } from "react-router-dom";
import {
  Box, Button, Card, CardContent, Chip, Grid, Skeleton, Typography,
} from "@mui/material";
import { ArrowBack, Edit, PictureAsPdf } from "@mui/icons-material";
import { useIncident } from "../hooks/useIncidents";
import { incidentsApi } from "../api/incidents";
import { STATIONS } from "../types";

function stationColor(name: string | null): string {
  if (!name) return "#888";
  const s = STATIONS.find((st) => st.name === name);
  return s?.line === "red" ? "#ef4444" : "#3b82f6";
}

function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Card sx={{ mb: 2.5 }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Box sx={{ width: 36, height: 36, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "primary.main", color: "white" }}>
            {icon}
          </Box>
          <Typography variant="h6">{title}</Typography>
        </Box>
        {children}
      </CardContent>
    </Card>
  );
}

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <Box sx={{ mb: 1 }}>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography variant="body1">{value || "Not specified"}</Typography>
    </Box>
  );
}

export default function IncidentDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: inc, isLoading, error } = useIncident(id ? Number(id) : null);
  const navigate = useNavigate();

  if (isLoading) return <Skeleton variant="rectangular" height={600} sx={{ borderRadius: 4 }} />;
  if (error) return <Typography color="error">{(error as Error).message}</Typography>;
  if (!inc) return <Typography color="error">Incident not found</Typography>;

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate("/incidents")}>Back</Button>
        <Typography variant="h4" sx={{ flex: 1 }}>
          Incident {inc.incident_number}
        </Typography>
        <Button variant="contained" startIcon={<Edit />} onClick={() => navigate(`/incidents/${inc.id}/edit`)}>
          Edit
        </Button>
        <Button variant="outlined" startIcon={<PictureAsPdf />} href={incidentsApi.reportUrl(inc.id)} target="_blank">
          PDF Report
        </Button>
      </Box>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <SectionCard title="General Information" icon={<Typography variant="h6">i</Typography>}>
            <Grid container spacing={2}>
              <Grid item xs={6}><Field label="Date" value={inc.date} /></Grid>
              <Grid item xs={6}><Field label="Time" value={inc.time} /></Grid>
              <Grid item xs={6}><Field label="Day" value={inc.day} /></Grid>
              <Grid item xs={6}><Field label="Shift" value={inc.shift} /></Grid>
              <Grid item xs={6}>
                <Field label="Station" value={inc.station} />
                {inc.station && <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: -0.5 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: stationColor(inc.station) }} />
                  <Typography variant="caption" color="text.secondary">
                    {STATIONS.find((s) => s.name === inc.station)?.line === "red" ? "Red Line" : "Blue Line"}
                  </Typography>
                </Box>}
              </Grid>
              <Grid item xs={6}><Field label="Location" value={inc.location} /></Grid>
              <Grid item xs={6}><Field label="Platform / Track" value={inc.platform_track} /></Grid>
              <Grid item xs={6}><Field label="Recorded By" value={inc.created_by_name} /></Grid>
              <Grid item xs={6}><Field label="Employee ID" value={inc.created_by_employee_id} /></Grid>
            </Grid>
            {inc.description && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary">Description</Typography>
                <Typography variant="body1">{inc.description}</Typography>
              </Box>
            )}
          </SectionCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <SectionCard title="Incident Type" icon={<Typography variant="h6">T</Typography>}>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {inc.incident_types.map((t) => (
                <Chip key={t.id} label={t.type_name} color="primary" variant="outlined" />
              ))}
              {inc.incident_types.length === 0 && <Typography variant="body2" color="text.secondary">Not specified</Typography>}
            </Box>
          </SectionCard>

          <SectionCard title="Detection & Reporting" icon={<Typography variant="h6">D</Typography>}>
            {inc.detection ? (
              <Grid container spacing={2}>
                <Grid item xs={6}><Field label="Discovered By" value={inc.detection.discovered_by} /></Grid>
                <Grid item xs={6}><Field label="First Reporter" value={inc.detection.first_reporter} /></Grid>
                <Grid item xs={6}><Field label="Detection Time" value={inc.detection.detection_time} /></Grid>
                <Grid item xs={6}><Field label="OCC Notification" value={inc.detection.occ_notification_time} /></Grid>
                <Grid item xs={6}><Field label="OCC Response" value={inc.detection.occ_response_time} /></Grid>
                <Grid item xs={6}><Field label="Emergency Code" value={inc.detection.emergency_code} /></Grid>
              </Grid>
            ) : <Typography variant="body2" color="text.secondary">Not specified</Typography>}
          </SectionCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <SectionCard title="Passenger Data" icon={<Typography variant="h6">P</Typography>}>
            {inc.passengers.length === 0 ? (
              <Typography variant="body2" color="text.secondary">Not specified</Typography>
            ) : inc.passengers.map((p, i) => (
              <Box key={p.id || i} sx={{ mb: 2, pb: 2, borderBottom: i < inc.passengers.length - 1 ? "1px solid" : "none", borderColor: "divider" }}>
                <Typography variant="subtitle2" mb={1}>Passenger {i + 1}</Typography>
                <Grid container spacing={1}>
                  <Grid item xs={6}><Field label="Name" value={p.name} /></Grid>
                  <Grid item xs={3}><Field label="Age" value={p.age !== null ? String(p.age) : null} /></Grid>
                  <Grid item xs={3}><Field label="Phone" value={p.phone} /></Grid>
                  <Grid item xs={6}><Field label="Emergency Contact" value={p.emergency_contact} /></Grid>
                  <Grid item xs={3}><Field label="Status" value={p.passenger_status} /></Grid>
                  <Grid item xs={3}><Field label="Hospital" value={p.hospital_name} /></Grid>
                </Grid>
              </Box>
            ))}
          </SectionCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <SectionCard title="Train Operations" icon={<Typography variant="h6">TR</Typography>}>
            {inc.train_operations ? (
              <Grid container spacing={2}>
                <Grid item xs={6}><Field label="Train Number" value={inc.train_operations.train_number} /></Grid>
                <Grid item xs={6}><Field label="Mode" value={inc.train_operations.operation_mode} /></Grid>
                <Grid item xs={6}><Field label="Location" value={inc.train_operations.current_location} /></Grid>
                <Grid item xs={6}><Field label="Destination" value={inc.train_operations.destination} /></Grid>
                <Grid item xs={6}><Field label="Rescue Train" value={inc.train_operations.rescue_train_number} /></Grid>
                <Grid item xs={3}><Field label="Rescue Start" value={inc.train_operations.rescue_start_time} /></Grid>
                <Grid item xs={3}><Field label="Rescue End" value={inc.train_operations.rescue_end_time} /></Grid>
              </Grid>
            ) : <Typography variant="body2" color="text.secondary">Not specified</Typography>}
          </SectionCard>

          <SectionCard title="Station Evacuation" icon={<Typography variant="h6">E</Typography>}>
            {inc.evacuation ? (
              <Grid container spacing={2}>
                <Grid item xs={6}><Field label="Order Time" value={inc.evacuation.evacuation_order_time} /></Grid>
                <Grid item xs={6}><Field label="Start Time" value={inc.evacuation.evacuation_start_time} /></Grid>
                <Grid item xs={6}><Field label="Completion Time" value={inc.evacuation.evacuation_completion_time} /></Grid>
                <Grid item xs={6}><Field label="OCC Clear Notice" value={inc.evacuation.station_clear_notification_time} /></Grid>
                <Grid item xs={6}><Field label="Reopening Time" value={inc.evacuation.station_reopening_time} /></Grid>
              </Grid>
            ) : <Typography variant="body2" color="text.secondary">Not specified</Typography>}
          </SectionCard>
        </Grid>

        <Grid item xs={12}>
          <SectionCard title="Staff" icon={<Typography variant="h6">S</Typography>}>
            {inc.staff.length === 0 ? (
              <Typography variant="body2" color="text.secondary">Not specified</Typography>
            ) : (
              <Grid container spacing={2}>
                {inc.staff.map((s, i) => (
                  <Grid item xs={12} sm={6} md={3} key={s.id || i}>
                    <Card variant="outlined" sx={{ p: 1.5 }}>
                      <Typography variant="subtitle2">{s.name || "Unnamed"}</Typography>
                      <Typography variant="caption" color="text.secondary" display="block">{s.role}</Typography>
                      <Typography variant="caption" color="text.secondary">ID: {s.employee_id || "-"}</Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </SectionCard>
        </Grid>

        <Grid item xs={12}>
          <SectionCard title="Impact Assessment" icon={<Typography variant="h6">IA</Typography>}>
            {inc.impact ? (
              <>
                <Grid container spacing={2} mb={2}>
                  <Grid item xs={4} sm={2}><Field label="Duration (min)" value={inc.impact.incident_duration !== null ? String(inc.impact.incident_duration) : null} /></Grid>
                  <Grid item xs={4} sm={2}><Field label="Response (min)" value={inc.impact.response_duration !== null ? String(inc.impact.response_duration) : null} /></Grid>
                  <Grid item xs={4} sm={2}><Field label="Train Delays" value={inc.impact.train_delays !== null ? String(inc.impact.train_delays) : null} /></Grid>
                  <Grid item xs={4} sm={2}><Field label="Affected" value={inc.impact.passengers_affected !== null ? String(inc.impact.passengers_affected) : null} /></Grid>
                  <Grid item xs={4} sm={2}><Field label="Injuries" value={inc.impact.injuries !== null ? String(inc.impact.injuries) : null} /></Grid>
                  <Grid item xs={4} sm={2}><Field label="Fatalities" value={inc.impact.fatalities !== null ? String(inc.impact.fatalities) : null} /></Grid>
                </Grid>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <Chip label={inc.impact.incident_closed ? "Closed" : "Open"} color={inc.impact.incident_closed ? "success" : "warning"} size="small" />
                  {inc.impact.closed_at && <Typography variant="caption" color="text.secondary">Closed: {inc.impact.closed_at}</Typography>}
                </Box>
                {inc.impact.cause && <Box sx={{ mb: 2 }}><Field label="Cause" value={inc.impact.cause} /></Box>}
                {inc.impact.corrective_actions && <Box sx={{ mb: 2 }}><Field label="Corrective Actions" value={inc.impact.corrective_actions} /></Box>}
                {inc.impact.lessons_learned && <Box sx={{ mb: 2 }}><Field label="Lessons Learned" value={inc.impact.lessons_learned} /></Box>}
              </>
            ) : <Typography variant="body2" color="text.secondary">Not specified</Typography>}
          </SectionCard>
        </Grid>
      </Grid>
    </Box>
  );
}
