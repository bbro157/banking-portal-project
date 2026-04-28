import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api";

function TransferPage() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [accounts, setAccounts] = useState([]);
  const [fromAccountId, setFromAccountId] = useState("");
  const [toAccountId, setToAccountId] = useState("");
  const [amount, setAmount] = useState("");

  // Fetch only THIS user's accounts
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await API.get(`/accounts/${userId}`);
        setAccounts(response.data);

        // default to first account
        if (response.data.length > 0) {
          setFromAccountId(response.data[0][0]);
        }
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };

    fetchAccounts();
  }, [userId]);

  const handleTransfer = async () => {
    try {
      await API.post("/transfer", {
        from_account_id: Number(fromAccountId),
        to_account_id: Number(toAccountId),
        amount: Number(amount),
      });

      alert("Transfer successful");
      navigate(`/dashboard/${userId}`);
    } catch (error) {
      console.error("Transfer error:", error);
      alert(error.response?.data?.detail || "Transfer failed");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Transfer Money</h1>

      {/* 🔒 SECURE CHANGE: dropdown instead of free input */}
      <div style={{ marginBottom: "1rem" }}>
        <label>From Account: </label>
        <select
          value={fromAccountId}
          onChange={(e) => setFromAccountId(e.target.value)}
        >
          {accounts.map((account) => (
            <option key={account[0]} value={account[0]}>
              {account[1]} | ID: {account[0]} | Balance: ${account[2]}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>To Account ID: </label>
        <input
          value={toAccountId}
          onChange={(e) => setToAccountId(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>Amount: </label>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <button onClick={handleTransfer}>Submit Transfer</button>

      <button
        onClick={() => navigate(`/dashboard/${userId}`)}
        style={{ marginLeft: "1rem" }}
      >
        Back
      </button>
    </div>
  );
}

export default TransferPage;