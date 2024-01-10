const mongoose = require("mongoose");

const mealSchema = mongoose.Schema({
  id: { type: String, unique: true },
  typeMeal: String,
  collation: String,
  stage: [Number],
  meat: String,
  meatQuantity: String,
  meatList: String,
  sauce: Number,
  sideDish: String,
  sideDishQuantity: String,
  sideDishList: String,
  drink: String,
  obs: String,
  dietBookId: String,
});

module.exports = mongoose.model("DietMeal", mealSchema);
