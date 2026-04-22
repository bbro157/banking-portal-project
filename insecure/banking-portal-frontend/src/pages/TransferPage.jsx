import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api";

function TransferPage() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [fromAccountId, setFromAccountId] = useState("");
  const [toAccountId, setToAccountId] = useState("");
  const [amount, setAmount] = useState("");

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
      alert("Transfer failed");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Transfer Money</h1>

      <div style={{ marginBottom: "1rem" }}>
        <label>From Account ID: </label>
        <input
          value={fromAccountId}
          onChange={(e) => setFromAccountId(e.target.value)}
        />
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