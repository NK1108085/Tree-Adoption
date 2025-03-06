import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import "./dashboard.css";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A569BD",
  "#D35400",
];

const Dashboard = () => {
  const [stats, setStats] = useState({ users: 0, plantation: 0 });
  const [treeData, setTreeData] = useState([]);

  // Fetch total users and plantations
  useEffect(() => {
    axios
      .get("http://localhost:5001/api/admin/stats")
      .then((response) => setStats(response.data))
      .catch((error) => console.error("Error fetching stats:", error));
  }, []);

  // Fetch tree data for the Donut Chart
  useEffect(() => {
    axios
      .get("http://localhost:5001/api/admin/plantations")
      .then((response) => {
        const trees = response.data;
        const treeCount = {};

        // Count occurrences of each tree type
        trees.forEach((tree) => {
          treeCount[tree.treeName] = (treeCount[tree.treeName] || 0) + 1;
        });

        // Convert to chart format
        const chartData = Object.keys(treeCount).map((name) => ({
          name,
          value: treeCount[name],
        }));

        setTreeData(chartData);
      })
      .catch((error) =>
        console.error("Error fetching plantation data:", error)
      );
  }, []);

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>

      {/* Stats Section */}
      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{stats.users}</p>
        </div>
        <div className="stat-card">
          <h3>Total Plantations</h3>
          <p>{stats.plantation}</p>
        </div>
      </div>

      {/* Donut Chart for Tree Distribution */}
      <div className="chart-container">
        <h2>Tree Plantation Distribution</h2>
        <PieChart width={400} height={400}>
          <Pie
            data={treeData}
            cx="50%"
            cy="50%"
            innerRadius={70} // Creates the "donut" effect
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {treeData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    </div>
  );
};

export default Dashboard;
