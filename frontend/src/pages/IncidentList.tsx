import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Button, Card, Chip, IconButton, Skeleton, Table, TableBody,
  TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Tooltip, Typography,
} from "@mui/material";
import { Add, Delete, Edit, PictureAsPdf, RemoveRedEye } from "@mui/icons-material";
import { useIncidentList, useDeleteIncident } from "../hooks/useIncidents";
import { incidentsApi } from "../api/incidents";
import { STATIONS } from "../types";

function stationColor(name: string | null): string {
  if (!name) return "#888";
  const s = STATIONS.find((st) => st.name === name);
  return s?.line === "red" ? "#ef4444" : "#3b82f6";
}

function formatDate(d: string | null): string {
  if (!d) return "-";
  const date = new Date(d + "T00:00:00");
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatTime(t: string | null): string {
  if (!t) return "-";
  const parts = t.split(":");
  if (parts.length < 2) return t;
  const h = parseInt(parts[0]!);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${parts[1]} ${ampm}`;
}

function shiftChip(s: string | null) {
  if (!s) return null;
  const config: Record<string, { color: "primary" | "warning" | "default"; label: string }> = {
    Morning: { color: "primary", label: "Morning" },
    Evening: { color: "warning", label: "Evening" },
    Night: { color: "default", label: "Night" },
  };
  const c = config[s] || { color: "default" as const, label: s };
  return <Chip size="small" color={c.color} label={c.label} />;
}

export default function IncidentList() {
  const { data: incidents, isLoading, error } = useIncidentList();
  const deleteMutation = useDeleteIncident();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const filtered = (incidents || []).filter(
    (inc) =>
      inc.incident_number.toLowerCase().includes(search.toLowerCase()) ||
      (inc.description || "").toLowerCase().includes(search.toLowerCase()),
  );

  const paged = filtered.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  if (isLoading) return <Skeleton variant="rectangular" height={500} sx={{ borderRadius: 4 }} />;
  if (error) return <Typography color="error">{(error as Error).message}</Typography>;

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Typography variant="h4">Incident Management</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate("/incidents/new")}>
          New Incident
        </Button>
      </Box>

      <TextField
        fullWidth
        placeholder="Search by incident # or description..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(0); }}
        sx={{ mb: 2 }}
      />

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Incident No.</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Time</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Shift</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Station</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paged.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6, color: "text.secondary" }}>
                    No incidents recorded
                  </TableCell>
                </TableRow>
              )}
              {paged.map((inc) => (
                <TableRow key={inc.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600} fontFamily="monospace">
                      {inc.incident_number}
                    </Typography>
                  </TableCell>
                  <TableCell>{formatDate(inc.date)}</TableCell>
                  <TableCell>{formatTime(inc.time)}</TableCell>
                  <TableCell>{shiftChip(inc.shift)}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: stationColor(inc.station), flexShrink: 0 }} />
                      {inc.station || "-"}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                      {inc.incident_types.slice(0, 2).map((t) => (
                        <Chip key={t.id} label={t.type_name} size="small" variant="outlined" />
                      ))}
                      {inc.incident_types.length > 2 && <Chip label={`+${inc.incident_types.length - 2}`} size="small" />}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {inc.description || "-"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <Tooltip title="View"><IconButton size="small" onClick={() => navigate(`/incidents/${inc.id}`)}><RemoveRedEye fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Edit"><IconButton size="small" onClick={() => navigate(`/incidents/${inc.id}/edit`)}><Edit fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="PDF">
                        <IconButton size="small" component="a" href={incidentsApi.reportUrl(inc.id)} target="_blank">
                          <PictureAsPdf fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={() => { if (window.confirm("Delete this incident?")) deleteMutation.mutate(inc.id); }}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          rowsPerPageOptions={[10, 20, 50]}
        />
      </Card>
    </Box>
  );
}
