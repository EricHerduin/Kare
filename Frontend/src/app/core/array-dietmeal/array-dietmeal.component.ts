import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DietBooksService } from "src/app/services/diet-book.service";
import { mealService } from "src/app/services/meal.service";
import { DietBook } from "src/app/models/diet.model";
import { Meal } from "src/app/models/meal.model";

@Component({
  selector: "app-array-dietmeal",
  templateUrl: "./array-dietmeal.component.html",
  styleUrls: ["./array-dietmeal.component.scss"],
})
export class ArrayDietmealComponent implements OnInit {
  dietbook: DietBook | null = null;
  dietMeals: Meal[] = [];
  dietMealsByStage: { [stage: number]: Meal[] } = {};
  dietId!: string;
  activeButtonMeal!: string;
  mealOrder: string[] = [
    "Petit-déjeuner",
    "Collation am",
    "Déjeuner",
    "Collation 1",
    "Collation 2",
    "Diner",
  ];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dietBookService: DietBooksService,
    private mealService: mealService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.dietId = params["dietId"];

      this.dietBookService
        .getDietBookById(this.dietId)
        .subscribe((dietbook) => {
          this.dietbook = dietbook;
          if (dietbook.meal) {
            this.loadDietMeals(dietbook.meal);
          }
        });
    });
  }

  loadDietMeals(dietMealIds: string[]): void {
    for (const id of dietMealIds) {
      this.mealService.getMealById(id).subscribe((meal) => {
        this.dietMeals.push(meal);
        this.organizeMealsByStage();
      });
    }
  }
  organizeMealsByStage(): void {
    // Organise les meals par stage dans dietMealsByStage
    this.dietMealsByStage = {};
    for (const meal of this.dietMeals) {
      for (const stage of meal.stage) {
        if (!this.dietMealsByStage[stage]) {
          this.dietMealsByStage[stage] = [];
        }
        this.dietMealsByStage[stage].push(meal);
      }
    }
    // Trie les meals dans l'ordre de mealOrder
    for (const stage in this.dietMealsByStage) {
      if (this.dietMealsByStage.hasOwnProperty(stage)) {
        this.dietMealsByStage[stage].sort((a, b) => {
          let nameA = this.getMealSortName(a);
          let nameB = this.getMealSortName(b);

          return this.mealOrder.indexOf(nameA) - this.mealOrder.indexOf(nameB);
        });
      }
    }
  }

  getRange(nbStage: number): number[] {
    return Array(nbStage)
      .fill(0)
      .map((_, index) => index + 1);
  }
  //renomme les collations am-pm1-pm2
  getMealSortName(meal: Meal) {
    let name = meal.typeMeal;
    let collation = meal.collation;

    if (meal.typeMeal === "Collation") {
      if (collation === "pm1") {
        name += " 1";
      } else if (collation === "pm2") {
        name += " 2";
      } else {
        name += " " + collation;
      }
    }

    return name;
  }
  getButtonWidth(index: number): string {
    const widths = ["17%", "12%", "12%", "13%", "13%", "8%"];
    return widths[index];
  }
  getButtonMinWidth(index: number): string {
    const minWidths = ["62px", "46px", "46px", "50px", "50px", "32px"];
    return minWidths[index];
  }
  checkMealExists(stage: number, mealName: string): boolean {
    const meal = this.dietMealsByStage[stage]?.find(
      (meal) => this.getMealSortName(meal) === mealName
    );
    return !!meal;
  }

  onViewMealForm(id: string) {
    this.activeButtonMeal = id;
    this.router.navigateByUrl(`dietbook?dietId=${this.dietId}&mealId=${id}`);
  }
}
