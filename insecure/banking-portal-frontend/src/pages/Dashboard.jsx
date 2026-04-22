import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api";

function Dashboard() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [searchAccountId, setSearchAccountId] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await API.get(`/accounts/${userId}`);
        setAccounts(response.data);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };

    fetchAccounts();
  }, [userId]);

 const handleLogout = () => {
  localStorage.removeItem("token"); // remove JWT
  navigate("/");
};

  const handleSearchTransactions = async () => {
    setMessage("");
    setTransactions([]);

    if (!searchAccountId) {
      setMessage("Please enter an account ID.");
      return;
    }

    try {
      const response = await API.get(`/transactions/${searchAccountId}`);
      setTransactions(response.data);

      if (response.data.length === 0) {
        setMessage("No transactions found for that account.");
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setMessage("Could not fetch transactions.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Dashboard</h1>
      <h2>User ID: {userId}</h2>

      <button onClick={() => navigate(`/transfer/${userId}`)}>
        Go to Transfer Page
      </button>

      <button onClick={handleLogout} style={{ marginLeft: "1rem" }}>
        Logout
      </button>

      <h3 style={{ marginTop: "2rem" }}>Accounts</h3>
      {accounts.length === 0 ? (
        <p>No accounts found.</p>
      ) : (
        <ul>
          {accounts.map((account) => (
            <li key={account[0]}>
              <strong>{account[1]}</strong> | Account ID: {account[0]} | Balance: ${account[2]} | Account #: {account[3]}
            </li>
          ))}
        </ul>
      )}

      <h3 style={{ marginTop: "2rem" }}>Search Transactions by Account ID</h3>
      <input
        type="text"
        placeholder="Enter any account ID"
        value={searchAccountId}
        onChange={(e) => setSearchAccountId(e.target.value)}
        style={{ marginRight: "1rem", padding: "0.5rem" }}
      />
      <button onClick={handleSearchTransactions}>Search</button>

      {message && <p style={{ marginTop: "1rem" }}>{message}</p>}

      {transactions.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Transactions</h3>
          <ul>
            {transactions.map((transaction) => (
              <li key={transaction[0]}>
                Transaction ID: {transaction[0]} | From: {String(transaction[1])} | To: {String(transaction[2])} | Amount: ${transaction[3]} | Type: {transaction[4]} | Date: {String(transaction[5])}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Dashboard;