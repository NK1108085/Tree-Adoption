import { useEffect, useState } from "react";
import axios from "axios";
import "./userslist.css";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [plantations, setPlantations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/admin/users")
      .then((response) => setUsers(response.data || []))
      .catch((error) => console.error("Error fetching users:", error));

    axios
      .get("http://localhost:5001/api/admin/plantations")
      .then((response) => setPlantations(response.data || []))
      .catch((error) => console.error("Error fetching plantations:", error));
  }, []);

  const downloadUserListReport = () => {
    const csvData = users
      .map((user) => {
        const userPlantations = plantations.filter(
          (plantation) => plantation.user?._id === user?._id
        );
        return `"${user?.name || "N/A"}","${user?.email || "N/A"}","${
          userPlantations.length
        }","${user?.points || 0}"`;
      })
      .join("\n");

    const csvContent = `Name,Email,Plantations Planted,Points\n${csvData}`;
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "user_list_report.csv";
    document.body.appendChild(a); // Append to body
    a.click();
    document.body.removeChild(a); // Remove after clicking
    window.URL.revokeObjectURL(url);
  };

  const filteredUsers = users.filter((user) =>
    user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="users-list">
      <h1>Users List</h1>

      <button onClick={downloadUserListReport}>Download Report</button>
      <input
        type="text"
        placeholder="  Search user..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Plantations Planted</th>
            <th>Plantation Details</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => {
            const userPlantations = plantations.filter(
              (plantation) => plantation.user?._id === user?._id
            );
            return (
              <tr key={user?._id || Math.random()}>
                <td>{user?.name || "N/A"}</td>
                <td>{user?.email || "N/A"}</td>
                <td>{userPlantations.length}</td>
                <td>
                  <ul>
                    {userPlantations.map((plantation) => (
                      <li key={plantation?._id || Math.random()}>
                        ({plantation?.location?.lat ?? "N/A"},{" "}
                        {plantation?.location?.lng ?? "N/A"})
                      </li>
                    ))}
                  </ul>
                </td>
                <td>{user?.points ?? 0}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UsersList;
