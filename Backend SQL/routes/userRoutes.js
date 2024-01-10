const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { body } = require("express-validator");

const userRoutes = (pool) => {
  router.post(
    "/signup",
    [body("email").isEmail(), body("password").isLength({ min: 6 })],
    (req, res, next) => userController.createUser(pool, req, res, next)
  );
  router.post("/login", (req, res, next) =>
    userController.login(pool, req, res, next)
  );
  router.get("/users", (req, res, next) =>
    userController.getUsers(pool, req, res, next)
  );
  return router;
};
module.exports = userRoutes;
