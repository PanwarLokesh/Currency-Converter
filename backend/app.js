const express = require("express");
const axios = require("axios");
const cors= require("cors");
const PORT = process.env.PORT || 5000;
require("dotenv").config();
const rateLimit = require("express-rate-limit");
const app = express();

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(express.json());
app.use(apiLimiter);
app.use(cors({origin:"http://localhost:5173"}))
app.post("/api/convert", async (req, res) => {

  try {
    const { from, to, amount } = req.body;
    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${process.env.API_KEY}/pair/${from}/${to}/${amount}`
    );
    if (response.data && response.data.result === "success") {
      res.status(200).json({
        base: from,
        target: to,
        conversionRate: response.data.conversion_rate,
        convertedAmount: response.data.conversion_result,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error converting currency",
    });
  }
});

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
