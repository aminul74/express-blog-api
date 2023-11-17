const express = require("express");
const app = express();
const authenticRoutes = require("./routes/authentic.route");
app.use(express.json());

app.post("/", (req, res) => {
  res.send("Home Page");
});

app.use("/api/v1/auth", authenticRoutes)

app.listen(3000, () => {
  console.log("server running onnn 3000 port");
});
