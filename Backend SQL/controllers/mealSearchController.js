const getMealCtrl = {};
// récupération d'un meal par son ID
getMealCtrl.getMealById = async (pool, req, res) => {
  try {
    const { mealId } = req.params;

    const [meal] = await pool.execute("SELECT * FROM DietMeal WHERE id=?", [
      mealId,
    ]);
    if (meal.length === 0) {
      return res.status(404).json({ message: "Meal not found" });
    }

    res.json(meal[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

getMealCtrl.getAllMeal = async (pool, req, res) => {
  try {
    const [dietMeals] = await pool.execute("SELECT * FROM DietMeal");
    res.json(dietMeals);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error meals" });
  }
};

module.exports = getMealCtrl;
