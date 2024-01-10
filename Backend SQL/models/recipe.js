const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  title: String,
  livret: { type: [String], required: false },
  ingredients: [String],
  recipe: [String],
  picture: [String],
  customerId: [String],
});

module.exports = mongoose.model("Recipe", recipeSchema);
