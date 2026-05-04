const express = require('express');
const dotend = require('dotenv').config();
const errorHandler = require('./middleware/errorHandler');
const { connect } = require('mongoose');
connectDB = require('./config/dbConnection');

connectDB();
const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/contacts", require("./routers/contactRoutes"));
app.use("/api/users", require("./routers/userRoutes"));

//Error handler middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
}
);

