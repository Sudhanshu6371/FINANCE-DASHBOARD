import React, { useState, useMemo } from "react";

export default function App() {
  const [role, setRole] = useState("viewer");
  const [search, setSearch] = useState("");
  const [transactions, setTransactions] = useState([
    { id: 1, date: "2026-03-01", amount: 5000, category: "Salary", type: "income" },
    { id: 2, date: "2026-03-02", amount: 1200, category: "Food", type: "expense" },
    { id: 3, date: "2026-03-03", amount: 800, category: "Transport", type: "expense" },
  ]);

  const income = transactions
    .filter(t => t.type === "income")
    .reduce((a, b) => a + b.amount, 0);

  const expense = transactions
    .filter(t => t.type === "expense")
    .reduce((a, b) => a + b.amount, 0);

  const balance = income - expense;

  const filtered = useMemo(() => {
    return transactions.filter(t =>
      t.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [transactions, search]);

  function addTransaction() {
    const category = prompt("Enter category")?.trim();
    const amountInput = prompt("Enter amount");
    const typeInput = prompt("Type income/expense")?.toLowerCase().trim();

    const amount = parseInt(amountInput, 10);

    // Validation
    if (!category || isNaN(amount) || !["income", "expense"].includes(typeInput)) {
      alert("Invalid input. Please try again.");
      return;
    }

    const newTx = {
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      category,
      amount,
      type: typeInput
    };

    setTransactions(prev => [...prev, newTx]);
  }

  function deleteTransaction(id) {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Finance Dashboard</h2>

      {/* Role */}
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="viewer">Viewer</option>
        <option value="admin">Admin</option>
      </select>

      {/* Summary */}
      <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
        <div>Balance: ₹{balance}</div>
        <div>Income: ₹{income}</div>
        <div>Expenses: ₹{expense}</div>
      </div>

      {/* Search */}
      <input
        placeholder="Search category"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginTop: 20 }}
      />

      {/* Add Button */}
      {role === "admin" && (
        <button onClick={addTransaction} style={{ marginLeft: 10 }}>
          Add
        </button>
      )}

      {/* Table */}
      <table border="1" cellPadding="10" style={{ marginTop: 20, width: "100%" }}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="5">No data</td>
            </tr>
          ) : (
            filtered.map(t => (
              <tr key={t.id}>
                <td>{t.date}</td>
                <td>{t.category}</td>
                <td>₹{t.amount}</td>
                <td>{t.type}</td>
                <td>
                  {role === "admin" ? (
                    <button onClick={() => deleteTransaction(t.id)}>Delete</button>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}