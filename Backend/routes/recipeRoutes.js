const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const recipeSearchController = require("../controllers/recipeSearchController");
const recipeAddController = require("../controllers/recipeAddDeleteCtrl");
const recipeController = require("../controllers/recipeController");

router.get("/", authMiddleware, recipeSearchController.getAllRecipe);
router.get("/:recipeId", authMiddleware, recipeSearchController.getRecipeById);
router.post("/add_recipe", authMiddleware, recipeAddController.addRecipe);
router.delete("/:recipeId", authMiddleware, recipeAddController.deleteRecipe);
router.put(
  "/modify_recipe/:recipeId",
  authMiddleware,
  recipeController.updateRecipe
);

module.exports = router;
