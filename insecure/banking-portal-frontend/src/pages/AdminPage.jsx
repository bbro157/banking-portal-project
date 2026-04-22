import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function AdminPage() {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await API.get("/admin/users-accounts");
        setRows(response.data);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchAdminData();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Admin Dashboard</h1>

      <button onClick={() => navigate("/")}>Logout</button>

      <h2 style={{ marginTop: "2rem" }}>All Users and Accounts</h2>

      {rows.length === 0 ? (
        <p>No data found.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ marginTop: "1rem", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Username</th>
              <th>Full Name</th>
              <th>Admin</th>
              <th>Account ID</th>
              <th>Account Type</th>
              <th>Balance</th>
              <th>Account Number</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td>{row[0]}</td>
                <td>{row[1]}</td>
                <td>{row[2]}</td>
                <td>{row[3] ? "Yes" : "No"}</td>
                <td>{row[4]}</td>
                <td>{row[5]}</td>
                <td>{row[6]}</td>
                <td>{row[7]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminPage;