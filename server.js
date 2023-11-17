const express = require("express");
const app = express();
const indexRoutes = require("./routes/index.route");
app.use(express.json());

app.use(indexRoutes);

app.use("/api/v1", indexRoutes);

app.listen(3000, () => {
  console.log("server running onnn 3000 port");
});

