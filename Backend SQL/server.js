// const express = require("express");
// const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// require("dotenv").config();

// // Import des routes

// const bookRoutes = require("./routes/bookRoutes");
// const userRoutes = require("./routes/userRoutes");
// const recipeRoutes = require("./routes/recipeRoutes");

// // Configuration de l'application
// const app = express();
// const port = process.env.PORT;

// // Configuration de mongoose
// mongoose.Promise = global.Promise;
// mongoose.connect(
//   "mongodb+srv://EricHdn:MDBGOfilyta26@cluster0.zdgr5vh.mongodb.net/B2DKonectApp",
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   }
// );
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, DELETE, PATCH, OPTIONS"
//   );
//   next();
// });

// // Middlewares
// app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // Routes
// app.use("/api/auth", userRoutes);
// app.use("/api/dietbooks", bookRoutes);
// app.use("/api/recipes", recipeRoutes);

// // Démarrage du serveur
// app.listen(port, () => {
//   console.log(`Serveur démarré sur le port ${port}`);
// });

require("dotenv").config();
const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const bodyParser = require("body-parser");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();
const port = process.env.PORT || 3000;
const userRoutes = require("./routes/userRoutes");
const bookRoutes = require("./routes/bookRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const recipeRoutes = require("./routes/recipeRoutes");

// Configuration de MySQL
const dbConfig = {
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
};

// Connexion à la base de données
const connectToDatabase = async () => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log("Connecté à la base de données MySQL!");
    return connection;
  } catch (error) {
    console.error("Erreur de connexion à la base de données:", error);
    throw error;
  }
};

app.use(express.json());

// Créer une connexion à la base de données
const pool = mysql.createPool(dbConfig);

// Middleware pour la gestion des erreurs
app.use(errorMiddleware);

// Middleware CORS
app.use(cors());

// Middleware pour traiter les requêtes JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//routes
app.use("/api/auth", userRoutes(pool));
app.use("/api/dietbooks", authMiddleware, bookRoutes(pool));
app.use("/api/recipes", authMiddleware, recipeRoutes(pool));

// Démarrage du serveur après la connexion à la base de données
connectToDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Serveur démarré sur le port ${port}`);
    });
  })
  .catch((error) => {
    // Si la connexion à la base de données échoue, le serveur ne sera pas démarré.
    console.error(
      "Le serveur n'a pas pu démarrer en raison d'une erreur de base de données:",
      error
    );
  });
