const mealAddDelController = {};

mealAddDelController.addMeal = async (pool, req, res) => {
  try {
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
      dietBookId,
    } = req.body || {};
    if (!typeMeal) {
      return res.status(400).json({ message: "Le champ typeMeal est requis" });
    }

    const [dietBook] = await pool.execute(
      "SELECT * FROM DietBook WHERE id = ?",
      [dietBookId]
    );

    if (dietBook.length === 0) {
      return res.status(404).json({ message: "DietBook not found" });
    }
    // Trier l'array stage du plus petit au plus grand
    const sortedStage = stage ? stage.slice().sort((a, b) => a - b) : null;

    await pool.execute(
      "INSERT INTO DietMeal (typeMeal, collation, collationList, stage, meat, meatQuantity, meatList, sauce, sideDish, sideDishQuantity, sideDishList, drink, obs, dietBookId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        typeMeal || null,
        collation || null,
        collationList || null,
        sortedStage || null,
        meat || null,
        meatQuantity || null,
        meatList || null,
        sauce || null,
        sideDish || null,
        sideDishQuantity || null,
        sideDishList || null,
        drink || null,
        obs || null,
        dietBookId || null,
      ]
    );

    // Récupérer l'ID auto-incrémenté de l'insertion précédente
    const lastInsertIdResult = await pool.execute("SELECT LAST_INSERT_ID()");
    const lastInsertId = lastInsertIdResult[0][0]["LAST_INSERT_ID()"];

    // Mettre à jour la variable meal dans DietBook
    const updatedMealList = [...(dietBook[0].meal || []), lastInsertId];

    await pool.execute("UPDATE DietBook SET meal = ? WHERE id = ?", [
      JSON.stringify(updatedMealList),
      dietBookId,
    ]);

    res.status(201).json({ message: "Meal created!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

mealAddDelController.deleteMeal = async (pool, req, res) => {
  try {
    const { mealId } = req.params;

    // Récupérer le dietBookId associé au meal
    const [bookResult] = await pool.execute(
      "SELECT dietBookId FROM DietMeal WHERE id = ?",
      [mealId]
    );

    if (bookResult.length === 0) {
      return res.status(404).json({ message: "DietMeal not found" });
    }

    const dietBookId = bookResult[0].dietBookId;

    // Supprimer le meal de la table DietMeal
    const [result] = await pool.execute("DELETE FROM DietMeal WHERE id = ?", [
      mealId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Meal not found" });
    }

    // Mettre à jour la variable meal dans DietBook
    const [bookResultAfterDelete] = await pool.execute(
      "SELECT * FROM DietBook WHERE id = ?",
      [dietBookId]
    );

    if (bookResultAfterDelete.length > 0) {
      // Retirer l'ID du meal supprimé
      const updatedMealArray = bookResultAfterDelete[0].meal.filter(
        (id) => id.toString() !== mealId.toString()
      );

      // Mettre à jour la base de données avec la nouvelle liste des ID de meals
      await pool.execute("UPDATE DietBook SET meal = ? WHERE id = ?", [
        updatedMealArray,
        bookResultAfterDelete[0].id,
      ]);
    }

    res.status(200).json({ message: "Meal deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = mealAddDelController;
