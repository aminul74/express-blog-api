const express = require("express");
const cors = require("cors");

const app = express();
const router = require("./routes/index.route");
require("dotenv").config();
const globalErrorHandler = require("./middleware/error.global.middleware");

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/api/v1", router);

app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
