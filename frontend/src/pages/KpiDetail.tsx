import { useNavigate } from "react-router-dom";
import {
  Box, Button, Card, CardContent, Grid, Skeleton, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Typography,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useKpi } from "../hooks/useKpi";

export default function KpiDetail() {
  const { data: kpi, isLoading } = useKpi();
  const navigate = useNavigate();

  if (isLoading) return <Skeleton variant="rectangular" height={500} sx={{ borderRadius: 4 }} />;
  if (!kpi) return <Typography color="error">Failed to load KPI data</Typography>;

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate("/dashboard")}>Back</Button>
        <Typography variant="h4">KPI Details</Typography>
      </Box>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>Response Times</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Metric</TableCell>
                      <TableCell align="right">Value</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Avg Response Time</TableCell>
                      <TableCell align="right">{kpi.avg_response_time ?? "-"} min</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Avg Evacuation Time</TableCell>
                      <TableCell align="right">{kpi.avg_evacuation_time ?? "-"} min</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>Incidents by Station</Typography>
              <TableContainer sx={{ maxHeight: 400 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Station</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="right">Count</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(kpi.incidents_by_station).map(([station, count]) => (
                      <TableRow key={station}>
                        <TableCell>{station}</TableCell>
                        <TableCell align="right">{count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>Incidents by Type</Typography>
              <TableContainer sx={{ maxHeight: 400 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="right">Count</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(kpi.incidents_by_type).map(([type, count]) => (
                      <TableRow key={type}>
                        <TableCell>{type}</TableCell>
                        <TableCell align="right">{count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>Monthly Trend</Typography>
              <TableContainer sx={{ maxHeight: 400 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Month</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="right">Count</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {kpi.monthly_trend.map((m) => (
                      <TableRow key={m.month}>
                        <TableCell>{m.month}</TableCell>
                        <TableCell align="right">{m.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
