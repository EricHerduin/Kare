// const express = require("express");
// const router = express.Router();
// const bookController = require("../controllers/bookController");
// const bookSearchCtrl = require("../controllers/bookSearchController");
// const bookAddDeleteCtrl = require("../controllers/bookAddDeleteController");
// const mealController = require("../controllers/mealController");
// const mealSearchCtrl = require("../controllers/mealSearchController");
// const mealAddDeleteCtrl = require("../controllers/mealAddDeleteCtrl");
// const authMiddleware = require("../middleware/authMiddleware");

// router.get("/", authMiddleware, bookSearchCtrl.getBooks);
// router.get("/:dietId", authMiddleware, bookSearchCtrl.getBookById);
// router.post("/add_diet_book", authMiddleware, bookAddDeleteCtrl.addDietBook);
// router.delete("/:dietId", bookAddDeleteCtrl.deleteBook);
// router.put(
//   "/modify-diet_book/:dietId",
//   authMiddleware,
//   bookController.updateBook
// );

// router.get("/meal/:mealId", authMiddleware, mealSearchCtrl.getMealById);
// router.post("/meal/add_meal", authMiddleware, mealAddDeleteCtrl.addMeal);
// router.get("/meals/all_meals", authMiddleware, mealSearchCtrl.getAllMeal);
// router.put("/modify_meal/:mealId", authMiddleware, mealController.updateMeal);

const express = require("express");
const router = express.Router();
const { AddDeleteDietbook } = require("../controllers/bookAddDeleteController");
const authMiddleware = require("../middleware/authMiddleware");
const bookSearchCtrl = require("../controllers/bookSearchController");
const updateBookCtrl = require("../controllers/bookController");
const getMealCtrl = require("../controllers/mealSearchController");
const mealAddDelController = require("../controllers/mealAddDeleteCtrl");
const mealUpdateController = require("../controllers/mealController");
const uploadMiddleware = require("../middleware/multer");

const bookRoutes = (pool) => {
  router.get("/", authMiddleware, (req, res, next) =>
    bookSearchCtrl.getBooks(pool, req, res, next)
  );
  router.get("/:dietId", authMiddleware, (req, res, next) =>
    bookSearchCtrl.getBookById(pool, req, res, next)
  );
  router.post("/add_diet_book", authMiddleware, (req, res, next) =>
    AddDeleteDietbook.addDietBook(pool, req, res, next)
  );
  router.post(
    "/diet_book/upload",
    uploadMiddleware.single("file"),
    (req, res) => {
      // La gestion des fichiers téléchargés peut être effectuée ici
      const filename = req.file.filename;
      res.json({ filename });
    }
  );

  router.delete("/:dietId", authMiddleware, (req, res, next) =>
    AddDeleteDietbook.deleteDietBook(pool, req, res, next)
  );
  router.put("/modify-diet_book/:dietId", authMiddleware, (req, res, next) =>
    updateBookCtrl.updateBook(pool, req, res, next)
  );
  router.get("/meals/all_meals", authMiddleware, (req, res, next) =>
    getMealCtrl.getAllMeal(pool, req, res, next)
  );
  router.get("/meal/:mealId", authMiddleware, (req, res, next) =>
    getMealCtrl.getMealById(pool, req, res, next)
  );
  router.post("/meal/add_meal", authMiddleware, (req, res, next) =>
    mealAddDelController.addMeal(pool, req, res, next)
  );
  router.delete("/meal/:mealId", authMiddleware, (req, res, next) =>
    mealAddDelController.deleteMeal(pool, req, res, next)
  );
  router.put("/modify_meal/:mealId", authMiddleware, (req, res, next) =>
    mealUpdateController.updateMeal(pool, req, res, next)
  );
  return router;
};

module.exports = bookRoutes;
