const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const User = sequelize.define("User", {
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  role: DataTypes.STRING,
  otp: DataTypes.STRING,
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "/user_default.jpg",
  },
});

module.exports = User;
