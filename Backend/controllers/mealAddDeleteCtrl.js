const DietMeal = require("../models/meal");
const DietBook = require("../models/book");
const jwt = require("jsonwebtoken");
// const Swal = require("sweetalert2");

const addMeal = async (req, res) => {
  try {
    const {
      typeMeal,
      collation,
      stage,
      meat,
      meatQuantity,
      meatList,
      sauce,
      sideDish,
      sideDishQuantity,
      sideDishList,
      drink,
      obs,
      dietBookId,
    } = req.body;

    const updateDietBook = await DietBook.findOne({ id: dietBookId });

    let count = await DietMeal.countDocuments();
    if (!count) {
      count = 0;
    }
    let id = count;
    let idExist = DietMeal.findOne({ id });
    while (idExist) {
      id++;
      idExist = await DietMeal.findOne({ id });
    }

    const dietmeal = new DietMeal({
      id,
      typeMeal,
      collation,
      stage,
      meat,
      meatQuantity,
      meatList,
      sauce,
      sideDish,
      sideDishQuantity,
      sideDishList,
      drink,
      obs,
      dietBookId,
    });
    updateDietBook.meal.push(dietmeal.id);
    dietmeal.save();
    res.status(201).json({ message: "Meal created !" });
    updateDietBook.save();
    // Swal.fire({
    //   title: "Repas créé",
    //   text: "Le repas a été ajouté avec succès",
    //   icon: "success",
    // });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
    // Swal.fire({
    //   title: "Erreur",
    //   text: "Echec lors de la création du repas",
    //   icon: "error",
    // });
  }
};

module.exports = {
  addMeal,
};
