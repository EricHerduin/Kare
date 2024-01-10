// uploadMiddleware.js

const multer = require("multer");

// Configuration du stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "assets/pics/uploads"); // Le dossier où les fichiers seront stockés
  },
  filename: (req, file, cb) => {
    const date = new Date().toISOString().replace(/:/g, "-");
    cb(null, date + "-" + file.originalname);
  },
});

// Filtrer les types de fichiers autorisés
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Le fichier n'est pas une image!"), false);
  }
};

// Configurer Multer
const upload = multer({ storage, fileFilter });

module.exports = upload;
