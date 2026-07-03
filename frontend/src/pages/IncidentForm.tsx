import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import {
  Box, Button, Card, CardContent, Checkbox, Chip, FormControl, FormControlLabel,
  Grid, InputLabel, ListItemText, MenuItem, OutlinedInput,
  Select, Step, StepLabel, Stepper, TextField, Typography,
} from "@mui/material";
import { useCreateIncident, useIncident, useUpdateIncident } from "../hooks/useIncidents";
import { STATIONS, SHIFTS, LOCATION_OPTIONS, DISCOVERED_BY_OPTIONS, TRAIN_MODES, INCIDENT_TYPES, STAFF_ROLES } from "../types";

const SECTION_NAMES = [
  "General Information", "Detection & Reporting", "Incident Type",
  "Passenger Data", "Train Operations", "Station Evacuation", "Staff", "Impact Assessment",
];

const defaultValues = {
  date: "", day: "", time: "", shift: "", station: "", location: "", platform_track: "",
  description: "", created_by_name: "", created_by_employee_id: "",
  discovered_by: "", first_reporter: "", emergency_code: "", permit_number: "",
  detection_time: "", occ_notification_time: "", occ_response_time: "",
  incident_types: [] as string[],
  passengers: [] as { name: string; age: string; phone: string; emergency_contact: string; passenger_status: string; hospital_name: string; first_aid_given: string; ambulance_request_time: string; ambulance_arrival_time: string; handover_time: string; departure_time: string }[],
  train_number: "", current_location: "", destination: "", operation_mode: "",
  rescue_train_number: "", rescue_start_time: "", rescue_end_time: "", handover_to_occ_time: "", return_to_service_time: "",
  evacuation_order_time: "", evacuation_start_time: "", evacuation_completion_time: "",
  station_clear_notification_time: "", station_reopening_time: "",
  staff: [] as { name: string; employee_id: string; role: string; digital_signature: string }[],
  incident_duration: "", response_duration: "", evacuation_duration: "", rescue_duration: "", train_delays: "", passengers_affected: "",
  injuries: "", fatalities: "", equipment_affected: "", cause: "", corrective_actions: "", lessons_learned: "", incident_closed: false,
};

function toTimeStr(v: string) {
  return v ? `${v}:00` : "";
}

function fromTimeStr(v: string | null | undefined) {
  return v ? v.slice(0, 5) : "";
}

function StationOption({ name, line }: { name: string; line: string }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: line === "red" ? "#ef4444" : "#3b82f6", flexShrink: 0 }} />
      {name}
    </Box>
  );
}

export default function IncidentForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const { data: existing } = useIncident(isEdit ? Number(id) : null);
  const createMutation = useCreateIncident();
  const updateMutation = useUpdateIncident(isEdit ? Number(id) : 0);
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const { control, handleSubmit, reset, watch, setValue } = useForm({ defaultValues });

  useEffect(() => {
    if (existing) {
      reset({
        date: existing.date || "",
        day: existing.day || "",
        time: fromTimeStr(existing.time),
        shift: existing.shift || "",
        station: existing.station || "",
        location: existing.location || "",
        platform_track: existing.platform_track || "",
        description: existing.description || "",
        created_by_name: existing.created_by_name || "",
        created_by_employee_id: existing.created_by_employee_id || "",
        discovered_by: existing.detection?.discovered_by || "",
        first_reporter: existing.detection?.first_reporter || "",
        emergency_code: existing.detection?.emergency_code || "",
        permit_number: existing.detection?.permit_number || "",
        detection_time: fromTimeStr(existing.detection?.detection_time),
        occ_notification_time: fromTimeStr(existing.detection?.occ_notification_time),
        occ_response_time: fromTimeStr(existing.detection?.occ_response_time),
        incident_types: existing.incident_types.map((t) => t.type_name),
        passengers: existing.passengers.map((p) => ({
          name: p.name || "", age: p.age != null ? String(p.age) : "",
          phone: p.phone || "", emergency_contact: p.emergency_contact || "",
          passenger_status: p.passenger_status || "", hospital_name: p.hospital_name || "",
          first_aid_given: p.first_aid_given || "",
          ambulance_request_time: fromTimeStr(p.ambulance_request_time),
          ambulance_arrival_time: fromTimeStr(p.ambulance_arrival_time),
          handover_time: fromTimeStr(p.handover_time),
          departure_time: fromTimeStr(p.departure_time),
        })),
        train_number: existing.train_operations?.train_number || "",
        current_location: existing.train_operations?.current_location || "",
        destination: existing.train_operations?.destination || "",
        operation_mode: existing.train_operations?.operation_mode || "",
        rescue_train_number: existing.train_operations?.rescue_train_number || "",
        rescue_start_time: fromTimeStr(existing.train_operations?.rescue_start_time),
        rescue_end_time: fromTimeStr(existing.train_operations?.rescue_end_time),
        handover_to_occ_time: fromTimeStr(existing.train_operations?.handover_to_occ_time),
        return_to_service_time: fromTimeStr(existing.train_operations?.return_to_service_time),
        evacuation_order_time: fromTimeStr(existing.evacuation?.evacuation_order_time),
        evacuation_start_time: fromTimeStr(existing.evacuation?.evacuation_start_time),
        evacuation_completion_time: fromTimeStr(existing.evacuation?.evacuation_completion_time),
        station_clear_notification_time: fromTimeStr(existing.evacuation?.station_clear_notification_time),
        station_reopening_time: fromTimeStr(existing.evacuation?.station_reopening_time),
        staff: existing.staff.map((s) => ({ name: s.name || "", employee_id: s.employee_id || "", role: s.role || "", digital_signature: s.digital_signature || "" })),
        incident_duration: existing.impact?.incident_duration != null ? String(existing.impact.incident_duration) : "",
        response_duration: existing.impact?.response_duration != null ? String(existing.impact.response_duration) : "",
        evacuation_duration: existing.impact?.evacuation_duration != null ? String(existing.impact.evacuation_duration) : "",
        rescue_duration: existing.impact?.rescue_duration != null ? String(existing.impact.rescue_duration) : "",
        train_delays: existing.impact?.train_delays != null ? String(existing.impact.train_delays) : "",
        passengers_affected: existing.impact?.passengers_affected != null ? String(existing.impact.passengers_affected) : "",
        injuries: existing.impact?.injuries != null ? String(existing.impact.injuries) : "",
        fatalities: existing.impact?.fatalities != null ? String(existing.impact.fatalities) : "",
        equipment_affected: existing.impact?.equipment_affected || "",
        cause: existing.impact?.cause || "",
        corrective_actions: existing.impact?.corrective_actions || "",
        lessons_learned: existing.impact?.lessons_learned || "",
        incident_closed: existing.impact?.incident_closed || false,
      });
    }
  }, [existing, reset]);

  const onSubmit = (data: typeof defaultValues) => {
    const payload: Record<string, unknown> = {
      date: data.date || null,
      day: data.day || null,
      time: toTimeStr(data.time) || null,
      shift: data.shift || null,
      station: data.station || null,
      location: data.location || null,
      platform_track: data.platform_track || null,
      description: data.description || null,
      created_by_name: data.created_by_name || null,
      created_by_employee_id: data.created_by_employee_id || null,
      detection: {
        discovered_by: data.discovered_by || null,
        first_reporter: data.first_reporter || null,
        emergency_code: data.emergency_code || null,
        permit_number: data.permit_number || null,
        detection_time: toTimeStr(data.detection_time) || null,
        occ_notification_time: toTimeStr(data.occ_notification_time) || null,
        occ_response_time: toTimeStr(data.occ_response_time) || null,
      },
      incident_types: data.incident_types.map((n) => ({ type_name: n })),
      passengers: data.passengers.map((p) => ({
        name: p.name || null, age: p.age ? parseInt(p.age) : null, phone: p.phone || null,
        emergency_contact: p.emergency_contact || null, passenger_status: p.passenger_status || null,
        hospital_name: p.hospital_name || null, first_aid_given: p.first_aid_given || null,
        ambulance_request_time: toTimeStr(p.ambulance_request_time) || null,
        ambulance_arrival_time: toTimeStr(p.ambulance_arrival_time) || null,
        handover_time: toTimeStr(p.handover_time) || null,
        departure_time: toTimeStr(p.departure_time) || null,
      })),
      train_operations: data.train_number ? {
        train_number: data.train_number, current_location: data.current_location || null,
        destination: data.destination || null, operation_mode: data.operation_mode || null,
        rescue_train_number: data.rescue_train_number || null,
        rescue_start_time: toTimeStr(data.rescue_start_time) || null,
        rescue_end_time: toTimeStr(data.rescue_end_time) || null,
        handover_to_occ_time: toTimeStr(data.handover_to_occ_time) || null,
        return_to_service_time: toTimeStr(data.return_to_service_time) || null,
      } : null,
      evacuation: data.evacuation_order_time ? {
        evacuation_order_time: toTimeStr(data.evacuation_order_time),
        evacuation_start_time: toTimeStr(data.evacuation_start_time) || null,
        evacuation_completion_time: toTimeStr(data.evacuation_completion_time) || null,
        station_clear_notification_time: toTimeStr(data.station_clear_notification_time) || null,
        station_reopening_time: toTimeStr(data.station_reopening_time) || null,
      } : null,
      staff: data.staff.map((s) => ({ name: s.name || null, employee_id: s.employee_id || null, role: s.role || null, digital_signature: s.digital_signature || null })),
      impact: {
        incident_duration: data.incident_duration ? parseInt(data.incident_duration) : null,
        response_duration: data.response_duration ? parseInt(data.response_duration) : null,
        evacuation_duration: data.evacuation_duration ? parseInt(data.evacuation_duration) : null,
        rescue_duration: data.rescue_duration ? parseInt(data.rescue_duration) : null,
        train_delays: data.train_delays ? parseInt(data.train_delays) : null,
        passengers_affected: data.passengers_affected ? parseInt(data.passengers_affected) : null,
        injuries: data.injuries ? parseInt(data.injuries) : null,
        fatalities: data.fatalities ? parseInt(data.fatalities) : null,
        equipment_affected: data.equipment_affected || null,
        cause: data.cause || null,
        corrective_actions: data.corrective_actions || null,
        lessons_learned: data.lessons_learned || null,
        incident_closed: data.incident_closed || null,
      },
    };

    const mutation = isEdit ? updateMutation : createMutation;
    mutation.mutate(payload, {
      onSuccess: (result) => navigate(`/incidents/${result.id}`),
    });
  };

  const stepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}><Controller name="date" control={control} render={({ field }) => <TextField {...field} fullWidth label="Date" type="date" InputLabelProps={{ shrink: true }} />} /></Grid>
            <Grid item xs={12} sm={6}><Controller name="day" control={control} render={({ field }) => <TextField {...field} fullWidth label="Day" />} /></Grid>
            <Grid item xs={12} sm={6}><Controller name="time" control={control} render={({ field }) => <TextField {...field} fullWidth label="Time" type="time" InputLabelProps={{ shrink: true }} />} /></Grid>
            <Grid item xs={12} sm={6}>
              <Controller name="shift" control={control} render={({ field }) => (
                <TextField {...field} select fullWidth label="Shift">
                  {SHIFTS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </TextField>
              )} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller name="station" control={control} render={({ field }) => (
                <TextField {...field} select fullWidth label="Station">
                  <MenuItem value="">Select station</MenuItem>
                  {STATIONS.map((s) => (
                    <MenuItem key={s.name} value={s.name}>
                      <StationOption name={s.name} line={s.line} />
                    </MenuItem>
                  ))}
                </TextField>
              )} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller name="location" control={control} render={({ field }) => (
                <TextField {...field} select fullWidth label="Location">
                  <MenuItem value="">Select location</MenuItem>
                  {LOCATION_OPTIONS.map((l) => <MenuItem key={l} value={l}>{l}</MenuItem>)}
                </TextField>
              )} />
            </Grid>
            <Grid item xs={12} sm={6}><Controller name="platform_track" control={control} render={({ field }) => <TextField {...field} fullWidth label="Platform / Track No." />} /></Grid>
            <Grid item xs={12} sm={6}><Controller name="created_by_name" control={control} render={({ field }) => <TextField {...field} fullWidth label="Recorded By" />} /></Grid>
            <Grid item xs={12} sm={6}><Controller name="created_by_employee_id" control={control} render={({ field }) => <TextField {...field} fullWidth label="Recorder Employee ID" />} /></Grid>
            <Grid item xs={12}><Controller name="description" control={control} render={({ field }) => <TextField {...field} fullWidth multiline rows={3} label="Incident Description" />} /></Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller name="discovered_by" control={control} render={({ field }) => (
                <TextField {...field} select fullWidth label="Discovered By">
                  <MenuItem value="">Select</MenuItem>
                  {DISCOVERED_BY_OPTIONS.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                </TextField>
              )} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller name="first_reporter" control={control} render={({ field }) => (
                <TextField {...field} select fullWidth label="First Reporter">
                  <MenuItem value="">Select</MenuItem>
                  {DISCOVERED_BY_OPTIONS.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                </TextField>
              )} />
            </Grid>
            <Grid item xs={12} sm={4}><Controller name="detection_time" control={control} render={({ field }) => <TextField {...field} fullWidth label="Detection Time" type="time" InputLabelProps={{ shrink: true }} />} /></Grid>
            <Grid item xs={12} sm={4}><Controller name="occ_notification_time" control={control} render={({ field }) => <TextField {...field} fullWidth label="OCC Notification Time" type="time" InputLabelProps={{ shrink: true }} />} /></Grid>
            <Grid item xs={12} sm={4}><Controller name="occ_response_time" control={control} render={({ field }) => <TextField {...field} fullWidth label="OCC Response Time" type="time" InputLabelProps={{ shrink: true }} />} /></Grid>
            <Grid item xs={12} sm={6}><Controller name="emergency_code" control={control} render={({ field }) => <TextField {...field} fullWidth label="Emergency Code" />} /></Grid>
            <Grid item xs={12} sm={6}><Controller name="permit_number" control={control} render={({ field }) => <TextField {...field} fullWidth label="Permit Number" />} /></Grid>
          </Grid>
        );

      case 2:
        return (
          <Controller name="incident_types" control={control} render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel>Incident Types</InputLabel>
              <Select {...field} multiple input={<OutlinedInput label="Incident Types" />} renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((v) => <Chip key={v} label={v} size="small" />)}
                </Box>
              )}>
                {INCIDENT_TYPES.map((t) => (
                  <MenuItem key={t} value={t}>
                    <Checkbox checked={field.value.includes(t)} />
                    <ListItemText primary={t} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )} />
        );

      case 3: {
        const passengers = watch("passengers");
        return (
          <Box>
            {passengers.map((_, i) => (
              <Card key={i} variant="outlined" sx={{ mb: 2, p: 2 }}>
                <Typography variant="subtitle2" mb={1}>Passenger {i + 1}</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}><Controller name={`passengers.${i}.name`} control={control} render={({ field }) => <TextField {...field} fullWidth label="Name" />} /></Grid>
                  <Grid item xs={3}><Controller name={`passengers.${i}.age`} control={control} render={({ field }) => <TextField {...field} fullWidth label="Age" type="number" />} /></Grid>
                  <Grid item xs={3}><Controller name={`passengers.${i}.phone`} control={control} render={({ field }) => <TextField {...field} fullWidth label="Phone" />} /></Grid>
                  <Grid item xs={6}><Controller name={`passengers.${i}.emergency_contact`} control={control} render={({ field }) => <TextField {...field} fullWidth label="Emergency Contact" />} /></Grid>
                  <Grid item xs={3}><Controller name={`passengers.${i}.passenger_status`} control={control} render={({ field }) => <TextField {...field} fullWidth label="Status" />} /></Grid>
                  <Grid item xs={3}><Controller name={`passengers.${i}.hospital_name`} control={control} render={({ field }) => <TextField {...field} fullWidth label="Hospital" />} /></Grid>
                  <Grid item xs={12}><Controller name={`passengers.${i}.first_aid_given`} control={control} render={({ field }) => <TextField {...field} fullWidth multiline rows={2} label="First Aid Given" />} /></Grid>
                  <Grid item xs={3}><Controller name={`passengers.${i}.ambulance_request_time`} control={control} render={({ field }) => <TextField {...field} fullWidth label="Amb. Request" type="time" InputLabelProps={{ shrink: true }} />} /></Grid>
                  <Grid item xs={3}><Controller name={`passengers.${i}.ambulance_arrival_time`} control={control} render={({ field }) => <TextField {...field} fullWidth label="Amb. Arrival" type="time" InputLabelProps={{ shrink: true }} />} /></Grid>
                  <Grid item xs={3}><Controller name={`passengers.${i}.handover_time`} control={control} render={({ field }) => <TextField {...field} fullWidth label="Handover" type="time" InputLabelProps={{ shrink: true }} />} /></Grid>
                  <Grid item xs={3}><Controller name={`passengers.${i}.departure_time`} control={control} render={({ field }) => <TextField {...field} fullWidth label="Departure" type="time" InputLabelProps={{ shrink: true }} />} /></Grid>
                </Grid>
              </Card>
            ))}
            <Button variant="outlined" onClick={() => setValue("passengers", [...passengers, { name: "", age: "", phone: "", emergency_contact: "", passenger_status: "", hospital_name: "", first_aid_given: "", ambulance_request_time: "", ambulance_arrival_time: "", handover_time: "", departure_time: "" }])}>
              + Add Passenger
            </Button>
          </Box>
        );
      }

      case 4:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}><Controller name="train_number" control={control} render={({ field }) => <TextField {...field} fullWidth label="Train Number" />} /></Grid>
            <Grid item xs={12} sm={6}>
              <Controller name="operation_mode" control={control} render={({ field }) => (
                <TextField {...field} select fullWidth label="Operation Mode">
                  <MenuItem value="">Select</MenuItem>
                  {TRAIN_MODES.map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                </TextField>
              )} />
            </Grid>
            <Grid item xs={12} sm={6}><Controller name="current_location" control={control} render={({ field }) => <TextField {...field} fullWidth label="Current Location" />} /></Grid>
            <Grid item xs={12} sm={6}><Controller name="destination" control={control} render={({ field }) => <TextField {...field} fullWidth label="Destination" />} /></Grid>
            <Grid item xs={12} sm={6}><Controller name="rescue_train_number" control={control} render={({ field }) => <TextField {...field} fullWidth label="Rescue Train No." />} /></Grid>
            <Grid item xs={12} sm={3}><Controller name="rescue_start_time" control={control} render={({ field }) => <TextField {...field} fullWidth label="Rescue Start" type="time" InputLabelProps={{ shrink: true }} />} /></Grid>
            <Grid item xs={12} sm={3}><Controller name="rescue_end_time" control={control} render={({ field }) => <TextField {...field} fullWidth label="Rescue End" type="time" InputLabelProps={{ shrink: true }} />} /></Grid>
            <Grid item xs={12} sm={3}><Controller name="handover_to_occ_time" control={control} render={({ field }) => <TextField {...field} fullWidth label="Handover to OCC" type="time" InputLabelProps={{ shrink: true }} />} /></Grid>
            <Grid item xs={12} sm={3}><Controller name="return_to_service_time" control={control} render={({ field }) => <TextField {...field} fullWidth label="Return to Service" type="time" InputLabelProps={{ shrink: true }} />} /></Grid>
          </Grid>
        );

      case 5:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}><Controller name="evacuation_order_time" control={control} render={({ field }) => <TextField {...field} fullWidth label="Order Time" type="time" InputLabelProps={{ shrink: true }} />} /></Grid>
            <Grid item xs={12} sm={4}><Controller name="evacuation_start_time" control={control} render={({ field }) => <TextField {...field} fullWidth label="Start Time" type="time" InputLabelProps={{ shrink: true }} />} /></Grid>
            <Grid item xs={12} sm={4}><Controller name="evacuation_completion_time" control={control} render={({ field }) => <TextField {...field} fullWidth label="Completion Time" type="time" InputLabelProps={{ shrink: true }} />} /></Grid>
            <Grid item xs={12} sm={6}><Controller name="station_clear_notification_time" control={control} render={({ field }) => <TextField {...field} fullWidth label="OCC Clear Notice" type="time" InputLabelProps={{ shrink: true }} />} /></Grid>
            <Grid item xs={12} sm={6}><Controller name="station_reopening_time" control={control} render={({ field }) => <TextField {...field} fullWidth label="Reopening Time" type="time" InputLabelProps={{ shrink: true }} />} /></Grid>
          </Grid>
        );

      case 6: {
        const staff = watch("staff");
        return (
          <Box>
            {staff.map((_, i) => (
              <Card key={i} variant="outlined" sx={{ mb: 2, p: 2 }}>
                <Typography variant="subtitle2" mb={1}>Staff {i + 1}</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}><Controller name={`staff.${i}.name`} control={control} render={({ field }) => <TextField {...field} fullWidth label="Name" />} /></Grid>
                  <Grid item xs={4}><Controller name={`staff.${i}.employee_id`} control={control} render={({ field }) => <TextField {...field} fullWidth label="Employee ID" />} /></Grid>
                  <Grid item xs={4}>
                    <Controller name={`staff.${i}.role`} control={control} render={({ field }) => (
                      <TextField {...field} select fullWidth label="Role">
                        {STAFF_ROLES.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                      </TextField>
                    )} />
                  </Grid>
                  <Grid item xs={12}><Controller name={`staff.${i}.digital_signature`} control={control} render={({ field }) => <TextField {...field} fullWidth label="Digital Signature" />} /></Grid>
                </Grid>
              </Card>
            ))}
            <Button variant="outlined" onClick={() => setValue("staff", [...staff, { name: "", employee_id: "", role: "", digital_signature: "" }])}>
              + Add Staff Member
            </Button>
          </Box>
        );
      }

      case 7:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}><Controller name="incident_duration" control={control} render={({ field }) => <TextField {...field} fullWidth label="Incident (min)" type="number" />} /></Grid>
            <Grid item xs={12} sm={3}><Controller name="response_duration" control={control} render={({ field }) => <TextField {...field} fullWidth label="Response (min)" type="number" />} /></Grid>
            <Grid item xs={12} sm={3}><Controller name="evacuation_duration" control={control} render={({ field }) => <TextField {...field} fullWidth label="Evacuation (min)" type="number" />} /></Grid>
            <Grid item xs={12} sm={3}><Controller name="rescue_duration" control={control} render={({ field }) => <TextField {...field} fullWidth label="Rescue (min)" type="number" />} /></Grid>
            <Grid item xs={12} sm={3}><Controller name="train_delays" control={control} render={({ field }) => <TextField {...field} fullWidth label="Train Delays" type="number" />} /></Grid>
            <Grid item xs={12} sm={4}><Controller name="passengers_affected" control={control} render={({ field }) => <TextField {...field} fullWidth label="Passengers Affected" type="number" />} /></Grid>
            <Grid item xs={12} sm={4}><Controller name="injuries" control={control} render={({ field }) => <TextField {...field} fullWidth label="Injuries" type="number" />} /></Grid>
            <Grid item xs={12} sm={4}><Controller name="fatalities" control={control} render={({ field }) => <TextField {...field} fullWidth label="Fatalities" type="number" />} /></Grid>
            <Grid item xs={12}><Controller name="equipment_affected" control={control} render={({ field }) => <TextField {...field} fullWidth label="Equipment Affected" />} /></Grid>
            <Grid item xs={12}><Controller name="cause" control={control} render={({ field }) => <TextField {...field} fullWidth multiline rows={2} label="Cause" />} /></Grid>
            <Grid item xs={12}><Controller name="corrective_actions" control={control} render={({ field }) => <TextField {...field} fullWidth multiline rows={2} label="Corrective Actions" />} /></Grid>
            <Grid item xs={12}><Controller name="lessons_learned" control={control} render={({ field }) => <TextField {...field} fullWidth multiline rows={2} label="Lessons Learned" />} /></Grid>
            <Grid item xs={12}>
              <Controller name="incident_closed" control={control} render={({ field }) => (
                <FormControlLabel control={<Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />} label="Incident Closed" />
              )} />
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      <Typography variant="h4" mb={3}>{isEdit ? "Edit Incident" : "Register New Incident"}</Typography>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stepper activeStep={activeStep} alternativeLabel>
            {SECTION_NAMES.map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
          </Stepper>
        </CardContent>
      </Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" mb={2}>{SECTION_NAMES[activeStep]}</Typography>
            {stepContent(activeStep)}
          </CardContent>
        </Card>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button disabled={activeStep === 0} onClick={() => setActiveStep((s) => s - 1)}>Previous</Button>
          <Box sx={{ display: "flex", gap: 1 }}>
            {activeStep < SECTION_NAMES.length - 1 ? (
              <Button variant="contained" onClick={() => setActiveStep((s) => s + 1)}>Next</Button>
            ) : (
              <Button type="submit" variant="contained" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Submit"}
              </Button>
            )}
          </Box>
        </Box>
      </form>
    </Box>
  );
}
