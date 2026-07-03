import { useState, type ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar, Box, CssBaseline, Drawer, IconButton, List, ListItemButton,
  ListItemIcon, ListItemText, Toolbar, Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import BarChartIcon from "@mui/icons-material/BarChart";
import DirectionsSubwayIcon from "@mui/icons-material/DirectionsSubway";

const DRAWER_WIDTH = 260;

const NAV_ITEMS = [
  { label: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
  { label: "All Incidents", path: "/incidents", icon: <ListAltIcon /> },
  { label: "New Incident", path: "/incidents/new", icon: <AddCircleIcon /> },
  { label: "KPI Details", path: "/kpi", icon: <BarChartIcon /> },
];

export default function Layout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          p: 2.5, display: "flex", alignItems: "center", gap: 1.5,
          borderBottom: "1px solid", borderColor: "divider",
        }}
      >
        <DirectionsSubwayIcon sx={{ fontSize: 32, color: "secondary.main" }} />
        <Box>
          <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2}>
            Smart Metro
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Operations System
          </Typography>
        </Box>
      </Box>
      <List sx={{ flex: 1, px: 1, pt: 1 }}>
        {NAV_ITEMS.map((item) => {
          const active = location.pathname === item.path;
          return (
            <ListItemButton
              key={item.path}
              selected={active}
              onClick={() => { navigate(item.path); setMobileOpen(false); }}
              sx={{ borderRadius: 2, mb: 0.5, "&.Mui-selected": { bgcolor: "primary.main", color: "white", "&:hover": { bgcolor: "primary.dark" } } }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: active ? "white" : "inherit" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, ml: { md: `${DRAWER_WIDTH}px` }, bgcolor: "primary.main" }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(!mobileOpen)} sx={{ mr: 2, display: { md: "none" } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Smart Metro Station Operations
          </Typography>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: "block", md: "none" }, "& .MuiDrawer-paper": { boxSizing: "border-box", width: DRAWER_WIDTH } }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{ display: { xs: "none", md: "block" }, "& .MuiDrawer-paper": { boxSizing: "border-box", width: DRAWER_WIDTH } }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, minHeight: "100vh", bgcolor: "background.default" }}>
        {children}
      </Box>
    </Box>
  );
}
