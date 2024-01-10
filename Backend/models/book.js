const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
  id: { type: String, unique: true },
  title: String,
  pathology: { type: String, required: true },
  sexe: String,
  nbStage: Number,
  nbWeekPerStage: Number,
  description: String,
  customerId: [String],
  meal: { type: [String], required: false },
});

module.exports = mongoose.model("DietBook", bookSchema);
