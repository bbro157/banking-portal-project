import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await API.post("/login", {
        username,
        password,
      });
      const token = response.data.access_token;
      const user = response.data.user;

      localStorage.setItem("token", token);

    // store user if needed
    localStorage.setItem("user", JSON.stringify(user));

    console.log(user.username);

      if (user.is_admin) {
        navigate("/admin");
      } else {
        navigate(`/dashboard/${user.id}`);
      }

    } catch (error) {
      console.error("Login error:", error);
      alert(error.response?.data?.detail || "Invalid username or password");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Banking Portal Login</h1>

      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ display: "block", marginBottom: "1rem" }}
      />

      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", marginBottom: "1rem" }}
      />

      <button onClick={handleLogin}>Login</button>

      <button onClick={() => navigate("/register")} style={{ marginLeft: "1rem" }}>
        Create New Account
      </button>
    </div>
  );
}

export default LoginPage;