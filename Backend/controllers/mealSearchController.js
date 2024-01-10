const DietMeal = require("../models/meal");
const jwt = require("jsonwebtoken");

// récupération d'un meal par son ID
const getMealById = async (req, res) => {
  try {
    const { mealId } = req.params;

    const meal = await DietMeal.findOne({ id: mealId });
    if (!meal) {
      return res.status(404).json({ message: "Meal not found" });
    }

    res.json(meal);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllMeal = async (req, res) => {
  try {
    const dietMeals = await DietMeal.find();
    res.json(dietMeals);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error meals" });
  }
};

module.exports = {
  getMealById,
  getAllMeal,
};
