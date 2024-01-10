const mysql = require("mysql2/promise");

const mealUpdateController = {};

mealUpdateController.updateMeal = async (pool, req, res) => {
  try {
    const { mealId } = req.params;

    const {
      typeMeal,
      collation,
      collationList,
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
    } = req.body;
    const [result] = await pool.execute("SELECT * FROM DietMeal WHERE id=?", [
      mealId,
    ]);

    const dietMeal = result[0];

    const updatedDietMeal = {
      typeMeal: typeMeal !== undefined ? typeMeal : dietMeal.typeMeal,
      collation: collation !== undefined ? collation : dietMeal.collation,
      collationList:
        collationList !== undefined
          ? collationList.slice()
          : dietMeal.collationList.slice(),
      stage:
        stage !== undefined
          ? stage.slice().sort((a, b) => a - b)
          : // Tri du plus petit au plus grand
            dietMeal.stage.slice().sort((a, b) => a - b),

      meat: meat !== undefined ? meat : dietMeal.meat,
      meatQuantity:
        meatQuantity !== undefined ? meatQuantity : dietMeal.meatQuantity,
      meatList: meatList !== undefined ? meatList : dietMeal.meatList,
      sauce: sauce !== undefined ? sauce : dietMeal.sauce,
      sideDish: sideDish !== undefined ? sideDish : dietMeal.sideDish,
      sideDishQuantity:
        sideDishQuantity !== undefined
          ? sideDishQuantity
          : dietMeal.sideDishQuantity,
      sideDishList:
        sideDishList !== undefined ? sideDishList : dietMeal.sideDishList,
      drink: drink !== undefined ? drink : dietMeal.drink,
      obs: obs !== undefined ? obs : dietMeal.obs,
      dietBookId: dietMeal.dietBookId,
    };
    console.log(updatedDietMeal.collationList);
    const updateQuery = `
  UPDATE DietMeal
  SET
    typeMeal = ?,
    collation = ?,
    collationList=?,
    stage = ?,
    meat = ?,
    meatQuantity = ?,
    meatList = ?,
    sauce = ?,
    sideDish = ?,
    sideDishQuantity = ?,
    sideDishList = ?,
    drink = ?,
    obs = ?
  WHERE id = ?;`;
    console.log(updatedDietMeal);
    const updateValues = [
      updatedDietMeal.typeMeal || null,
      updatedDietMeal.collation || null,
      updatedDietMeal.collationList || null,
      updatedDietMeal.stage || null,
      updatedDietMeal.meat || null,
      updatedDietMeal.meatQuantity || null,
      updatedDietMeal.meatList || null,
      updatedDietMeal.sauce || null,
      updatedDietMeal.sideDish || null,
      updatedDietMeal.sideDishQuantity || null,
      updatedDietMeal.sideDishList || null,
      updatedDietMeal.drink || null,
      updatedDietMeal.obs || null,
      mealId, // Ajoutez l'identifiant du meal ici
    ];
    await pool.execute(updateQuery, updateValues);
    res.status(201).json({ message: "meal mis à jour" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error update Meals" });
  }
};

module.exports = mealUpdateController;
