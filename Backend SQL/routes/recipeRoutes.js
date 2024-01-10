const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const recipeSearchController = require("../controllers/recipeSearchController");
const recipeAddController = require("../controllers/recipeAddDeleteCtrl");
const recipeController = require("../controllers/recipeController");
const upload = require("../middleware/multer");

const recipeRoutes = (pool) => {
  router.get("/", authMiddleware, (req, res, next) =>
    recipeSearchController.getAllRecipe(pool, req, res, next)
  );
  router.get("/:recipeId", authMiddleware, (req, res, next) =>
    recipeSearchController.getRecipeById(pool, req, res, next)
  );
  router.post(
    "/add_recipe",
    authMiddleware,
    upload.single("pics"),
    (req, res, next) => recipeAddController.addRecipe(pool, req, res, next)
  );
  router.put(
    "/modify_recipe/:recipeId",
    authMiddleware,
    upload.single("pics"),
    (req, res, next) => recipeController.updateRecipe(pool, req, res, next)
  );
  router.delete("/:recipeId", authMiddleware, (req, res, next) =>
    recipeAddController.deleteRecipe(pool, req, res, next)
  );
  return router;
};

module.exports = recipeRoutes;
