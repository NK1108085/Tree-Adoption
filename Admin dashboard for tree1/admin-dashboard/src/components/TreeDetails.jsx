import { useEffect, useState } from "react";
import axios from "axios";

const TreeDetails = () => {
  const [plantations, setPlantations] = useState([]); // Changed to plantations

  useEffect(() => {
    axios.get("http://localhost:5001/api/admin/plantations") // Updated to reflect the correct endpoint
      .then(response => setPlantations(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="tree-details">
      <h1>Plantation Details</h1> {/* Changed to Plantation */}
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Image</th>
            <th>Location</th>
            <th>Date Planted</th>
          </tr>
        </thead>
        <tbody>
          {plantations.map((plantation) => ( // Changed from trees to plantations
            <tr key={plantation._id}>
              <td>{plantation.user.name}</td> {/* Changed tree.userId to plantation.user */}
              <td><img src={plantation.image} alt="Plantation" width="100" /> {/* Changed tree.imageUrl */}
              </td>
              <td>{plantation.location}</td> {/* Changed tree.location */}
              <td>{new Date(plantation.createdAt).toLocaleDateString()}</td> {/* Changed tree.datePlanted */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TreeDetails;
