const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

// Import des routes

const bookRoutes = require("./routes/bookRoutes");
const userRoutes = require("./routes/userRoutes");
const recipeRoutes = require("./routes/recipeRoutes");

// Configuration de l'application
const app = express();
const port = 5400;

// Configuration de mongoose
mongoose.Promise = global.Promise;
mongoose.connect(
  "mongodb+srv://EricHdn:MDBGOfilyta26@cluster0.zdgr5vh.mongodb.net/B2DKonectApp",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/dietbooks", bookRoutes);
app.use("/api/recipes", recipeRoutes);

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
