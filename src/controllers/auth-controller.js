const userService = require("../services/user-service");

const register = async (req, res) => {
  try {
    const user = await userService.register(req.body);
    res.status(201).json({ message: "User registered", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await userService.login(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
};
