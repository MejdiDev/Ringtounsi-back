const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const HttpException = require("./utils/HttpException.utils");
const errorMiddleware = require("./middleware/error.middleware");
const userRouter = require("./routes/user.route");
const coachRouter = require("./routes/coach.route");


const app = express();
require('dotenv').config();
app.use(express.json());
app.use(cors());
app.options("*", cors());

const port = Number(process.env.PORT || 3000);

app.use(`/api/v1/users`, userRouter);
app.use(`/api/v1/coaches`, coachRouter);


app.get("/api/v1", (req, res) => {
  res.json({ message: "Welcome to ringTounsi application." });
});
// 404 error
app.all("*", (req, res, next) => {
  const err = new HttpException(404, "Endpoint Not Found");
  next(err);
});

// Error middleware
app.use(errorMiddleware);

// starting the server
app.listen(port, () => console.log(`🚀 Server running on port ${port}!`));

module.exports = app;
