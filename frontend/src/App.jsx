import { useState } from "react";
import "./App.css";
import axios from "axios";
function App() {
  const currencyCodes = [
    "USD",
    "EUR",
    "GBP",
    "GHS",
    "JPY",
    "CAD",
    "BSD",
    "INR",
  ];
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    amount: "",
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  function onChangeHandler(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function fetchData(e) {
    e.preventDefault();
    if (!formData.from || !formData.to || !formData.amount) {
      setError("Please fill in all fields.");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/api/convert",
        formData
      );
      setResult(response?.data);
      setError("");
      
    } catch (error) {
      console.log(error);
      setError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  }
  return (
    <div className="page">
      <div className="header">
        <h1>Global Currency Converter</h1>
        <p>Your go-to solution for real-time currency conversions worldwide</p>
      </div>
      <div className="converter">
        <form onSubmit={(e) => fetchData(e)} action="">
          <select name="from" id="from" onChange={(e) => onChangeHandler(e)}>
            <option value={formData.from}>Select From Currency</option>
            {currencyCodes.map((code, index) => {
              return <option key={index}>{code}</option>;
            })}
          </select>
          <select name="to" id="to" onChange={(e) => onChangeHandler(e)}>
            <option value={formData.to}>Select to Currency</option>
            {currencyCodes.map((code, index) => {
              return <option key={index}>{code}</option>;
            })}
          </select>
          <input
            type="number"
            placeholder="Amount"
            name="amount"
            value={formData.amount}
            onChange={(e) => onChangeHandler(e)}
          />
          <button type="submit">Convert</button>
          {result && (
            <div className="result">
              <p>Conversion Rate: {result.conversionRate}</p>
              <p>Converted Amount: {result.convertedAmount}</p>
            </div>
          )}
          {error && (
            <p style={{ color: "red", textAlign: "center" }}>Error: {error}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default App;
