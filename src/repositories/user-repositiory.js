const { User } = require("../models");

const createUser = (data) => {
  return User.create(data);
};

const getAllUsers = () => {
  return User.findAll({
    attributes: { exclude: ["password"] }, // Don't return passwords in list
  });
};

const getUserById = (id) => {
  return User.findByPk(id, {
    attributes: { exclude: ["password"] }, // Don't return password
  });
};

const getUserByEmail = (email) => {
  return User.findOne({
    where: { email },
    // Include password for login verification only
    attributes: ["id", "name", "email", "password"],
  });
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  getUserByEmail,
};
