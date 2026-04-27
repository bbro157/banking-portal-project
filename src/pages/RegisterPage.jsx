import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/signup", {
        username,
        password,
        full_name: fullName,
        is_admin: false,
      });

      setMessage(response.data.message);
      alert("Account created successfully");
      navigate("/");
    } catch (error) {
      console.error("Signup error:", error);
      setMessage(error.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Create Account</h1>

      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Full Name: </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Username: </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">Register</button>
      </form>

      {message && <p style={{ marginTop: "1rem" }}>{message}</p>}

      <button onClick={() => navigate("/")} style={{ marginTop: "1rem" }}>
        Back to Login
      </button>
    </div>
  );
}

export default RegisterPage;