require("dotenv").config();
const express = require("express");
const cors = require("cors");

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
