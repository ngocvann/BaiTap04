require("dotenv").config();
const express = require("express");
const cors = require("cors");

const rateLimit = require("express-rate-limit");

const { connectDB, sequelize } = require("./config/database");
const configViewEngine = require("./config/viewEngine");
const routerAPI = require("./routes/api");

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configViewEngine(app);
app.use("/api", routerAPI);

(async () => {
  await connectDB();
  await sequelize.sync();
  app.listen(port, () => console.log(`Server is running on port ${port}`));
})();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    status: 429,
    message: "Quá nhiều request từ IP này, vui lòng thử lại sau 15 phút.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", limiter);
