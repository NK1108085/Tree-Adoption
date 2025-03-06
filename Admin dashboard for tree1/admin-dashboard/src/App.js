import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import UsersList from "./components/UsersList";
import GovernmentReport from "./components/GovernmentReport";
import QRScanner from "./components/QRScanner";
import QRDetails from "./components/QRDetails";

function App() {
  return (
    <Router>
      <div className="admin-container">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<UsersList />} />
          <Route path="/reports" element={<GovernmentReport />} />
          <Route path="/qr-scanner" element={<QRScanner />} />
          <Route path="/qr-details" element={<QRDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
