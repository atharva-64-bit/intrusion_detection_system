import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import LiveMonitor from "./pages/LiveMonitor";
import ThreatLogs from "./pages/ThreatLogs";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import AttackValidation from "./pages/AttackValidation";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/live" element={<LiveMonitor />} />
        <Route path="/logs" element={<ThreatLogs />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/validation" element={<AttackValidation />} />
      </Route>
    </Routes>
  );
}

export default App;
