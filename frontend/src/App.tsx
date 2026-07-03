import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import IncidentList from "./pages/IncidentList";
import IncidentForm from "./pages/IncidentForm";
import IncidentDetail from "./pages/IncidentDetail";
import KpiDetail from "./pages/KpiDetail";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/incidents" element={<IncidentList />} />
        <Route path="/incidents/new" element={<IncidentForm />} />
        <Route path="/incidents/:id" element={<IncidentDetail />} />
        <Route path="/incidents/:id/edit" element={<IncidentForm />} />
        <Route path="/kpi" element={<KpiDetail />} />
      </Routes>
    </Layout>
  );
}
