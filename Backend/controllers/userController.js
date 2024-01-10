require("dotenv").config();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userController = {};

userController.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

userController.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({ message: "user non trouvé" });
    }

    // Check if password is correct
    const isPasswordCorrect = bcrypt.compare(existingUser.password, password);
    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ message: "mot de passe et/ou utilisateur incorrect" });
    }

    // Check if password is expired
    const passwordExpiresAt = existingUser.passwordExpiresAt;
    const isPasswordExpired =
      passwordExpiresAt && new Date(passwordExpiresAt) < new Date();
    if (isPasswordExpired) {
      return res.status(401).json({ message: "Password expired" });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: existingUser._id },
      `${process.env.JWT_SECRET}`,
      { expiresIn: "24h" }
    );

    //enregistre le token dans le local Storage
    // localStorage.setItem("token", token);

    res.status(200).json({ userId: existingUser._id, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = userController;
