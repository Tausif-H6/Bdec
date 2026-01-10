const userRepository = require("../repositories/user-repositiory");
bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const register = async (data) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await userRepository.createUser({
    name: data.name,
    email: data.email,
    password: hashedPassword,
  });

  return user;
};

// const login = async (email, password) => {
//   const user = await userRepository.getUserByEmail(email);

//   if (!user || !user.password) {
//     throw new Error("Invalid credentials");
//   }

//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) {
//     throw new Error("Invalid credentials");
//   }

//   const token = jwt.sign(
//     { id: user.id, email: user.email },
//     process.env.JWT_SECRET,
//     { expiresIn: process.env.JWT_EXPIRES_IN }
//   );

//   return { token };
// };
const login = async (email, password) => {
  console.log(`🔍 Login attempt for email: ${email}`);

  // Find user with password
  const user = await userRepository.getUserByEmail(email);
  console.log("User found:", user ? "Yes" : "No");

  if (!user) {
    console.log("❌ No user found with this email");
    throw new Error("Invalid credentials");
  }

  console.log("User data:", {
    id: user.id,
    email: user.email,
    hasPassword: !!user.password,
    passwordLength: user.password?.length,
  });

  // Check password
  console.log("Comparing passwords...");
  console.log("Input password:", password);
  console.log("Stored hash:", user.password?.substring(0, 30) + "...");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  console.log("Password valid?", isPasswordValid);

  if (!isPasswordValid) {
    console.log("❌ Password comparison failed");
    throw new Error("Invalid credentials");
  }

  // Create JWT token
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: "24h" }
  );

  // Return user data without password
  const { password: _, ...userWithoutPassword } = user.toJSON();

  console.log("✅ Login successful for user:", user.email);
  return {
    message: "Login successful",
    user: userWithoutPassword,
    token,
  };
};
// ADD THIS METHOD
const getUsers = async () => {
  return await userRepository.getAllUsers();
};

// ADD THIS METHOD
const getUserById = async (id) => {
  return await userRepository.getUserById(id);
};

module.exports = {
  register,
  login,
  getUsers,
  getUserById,
};
