import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Admin Panel</h2>
      <ul>
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/users">Users</Link></li>
        <li><Link to="/reports">Locations</Link></li>
        <li><Link to="/qr-scanner">QR Scanner</Link></li> {/* Add QR Scanner Link */}
      </ul>
    </div>
  );
};

export default Sidebar;
