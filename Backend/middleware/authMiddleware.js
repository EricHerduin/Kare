require("dotenv").config();
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const storedToken = req.headers.authorization.split(" ")[1];
  // const storedToken = localStorage.getItem("token"); // récupère le token dans le localstorage

  if (!storedToken) {
    return res
      .status(401)
      .json({ message: "Authentification failed. Token not found." });
  }

  try {
    const decodedToken = jwt.verify(storedToken, process.env.JWT_SECRET);
    req.auth = { userId: decodedToken.userId };
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Authentification failed. Invalid token." });
  }
};

module.exports = authMiddleware;
