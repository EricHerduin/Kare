require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userController = {};

userController.createUser = async (pool, req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if user already exists
    const [existingUser] = await pool.execute(
      "SELECT * FROM User WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    await pool.execute(
      "INSERT INTO User (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    next(new Error("Something went wrong"));
  }
};
userController.login = async (pool, req, res, next) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const [existingUser] = await pool.execute(
      "SELECT * FROM User WHERE email = ?",
      [email]
    );

    if (existingUser.length === 0) {
      return res
        .status(401)
        .json({ message: "password or Username incorrect. Try to reconnect" });
    }

    const user = existingUser[0];

    // Vérifier si le mot de passe est correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ message: "Incorrect password or username" });
    }

    // Vérifier si le mot de passe a expiré (tu peux adapter cette partie en fonction de ton schéma)
    const passwordExpiresAt = user.passwordExpiresAt;
    const isPasswordExpired =
      passwordExpiresAt && new Date(passwordExpiresAt) < new Date();

    if (isPasswordExpired) {
      return res.status(401).json({
        message: "Password expired",
        passwordExpired: true,
        redirect: "/change-password",
      });
    }

    // Créer le token JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res
      .status(200)
      .json({ userId: user.id, token, role: user.role, name: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

userController.getUsers = async (pool, req, res, next) => {
  try {
    const [users] = await pool.execute("SELECT * FROM User");

    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "une erreur est survenue pour l'affichage de la liste des users",
    });
  }
};

module.exports = userController;
