const express = require("express");
const app = express();
const indexRoutes = require("./routes/index.route");
require("dotenv").config();
const cookieParser = require('cookie-parser');
const globalErrorHandler = require("./middleware/error.global.middleware");

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use("/api/v1", indexRoutes);


app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
