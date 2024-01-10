const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const bookSearchCtrl = require("../controllers/bookSearchController");
const bookAddDeleteCtrl = require("../controllers/bookAddDeleteController");
const mealController = require("../controllers/mealController");
const mealSearchCtrl = require("../controllers/mealSearchController");
const mealAddDeleteCtrl = require("../controllers/mealAddDeleteCtrl");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, bookSearchCtrl.getBooks);
router.get("/:dietId", authMiddleware, bookSearchCtrl.getBookById);
router.post("/add_diet_book", authMiddleware, bookAddDeleteCtrl.addDietBook);
router.delete("/:dietId", bookAddDeleteCtrl.deleteBook);
router.put(
  "/modify-diet_book/:dietId",
  authMiddleware,
  bookController.updateBook
);

router.get("/meal/:mealId", authMiddleware, mealSearchCtrl.getMealById);
router.post("/meal/add_meal", authMiddleware, mealAddDeleteCtrl.addMeal);
router.get("/meals/all_meals", authMiddleware, mealSearchCtrl.getAllMeal);
router.put("/modify_meal/:mealId", authMiddleware, mealController.updateMeal);

module.exports = router;
