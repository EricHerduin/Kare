import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DietBooksService } from "src/app/services/diet-book.service";
import { DietBook } from "src/app/models/diet.model";
import { Meal } from "../../../models/meal.model";
import { EMPTY, Observable, switchMap, map, tap } from "rxjs";
import { mealService } from "src/app/services/meal.service";

@Component({
  selector: "app-meal-list",
  templateUrl: "./meal-list.component.html",
  styleUrls: ["./meal-list.component.scss"],
})
export class MealListComponent implements OnInit {
  dietBook$!: Observable<DietBook>;
  loading!: boolean;
  viewTitle!: boolean;
  errorMsg!: string;
  public dietId!: string;
  public mealIds!: Array<string>;
  meals!: Meal[];
  typeMeals!: Meal[];
  constructor(
    private router: Router,
    private dietBook: DietBooksService,
    private dietMealService: mealService,
    private route: ActivatedRoute
  ) {}
  dietBookId = this.route.snapshot.params["id"];
  ngOnInit(): void {
    this.viewTitle = true;
    this.route.queryParams.subscribe((params) => {
      this.dietId = params["dietId"];
      this.dietBook.getDietBookById(this.dietId).subscribe((dietbook) => {
        if (dietbook.meal?.length === 0) {
          this.viewTitle = false;
        }
        if (dietbook.meal) {
          this.mealIds = dietbook.meal.map((m) => m);
        }
      });
    });
    this.dietMealService
      .getAllMeat()
      .pipe(
        map((meals) => meals.filter((meal) => this.mealIds.includes(meal.id)))
      )
      .subscribe((filteredMeals) => {
        this.meals = filteredMeals;
      });
  }
  onViewMealForm(id: string) {
    this.router.navigateByUrl(`dietbook?dietId=${this.dietId}&mealId=${id}`);
  }
  onViewTypeMeal(stage: number) {
    this.meals.map((mealsFilterbyStage) =>
      mealsFilterbyStage.stage.includes(stage)
    );
  }
}
