import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { Observable, take, tap, map } from "rxjs";
import { DietBook } from "src/app/models/diet.model";
import { ActivatedRoute, Router } from "@angular/router";
import { DietBooksService } from "src/app/services/diet-book.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { SharedService } from "src/app/services/shared.service";

import { mealService } from "src/app/services/meal.service";
import { Meal } from "src/app/models/meal.model";

@Component({
  selector: "app-single-diet",
  templateUrl: "./single-diet.component.html",
  styleUrls: ["./single-diet.component.scss"],
})
export class SingleDietComponent implements OnInit {
  dietbook$!: Observable<DietBook>;
  dietBook!: DietBook;
  meals!: Meal[];
  MealsToDisplay!: Meal[];
  mealIds!: string[];
  dietBookFormRead!: FormGroup;
  activeButton!: number;
  activeButtonMeal!: string;
  selectedStage!: string;
  save!: string;
  mealOrder: string[] = [
    "Petit-déjeuner",
    "Collation-am",
    "Déjeuner",
    "Collation-pm1",
    "Collation-pm2",
    "Diner",
  ];
  public dietId!: string;
  public mealId!: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dietBookService: DietBooksService,
    private mealService: mealService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService
  ) {}

  @Output() closeMealForm: EventEmitter<void> = new EventEmitter<void>();

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.dietId = params["dietId"];
      this.mealId = params["mealId"];
      this.sharedService.setTextHeader(`Livret N° ${this.dietId}`);

      this.dietbook$ = this.dietBookService.getDietBookById(this.dietId);
      // this.dietBookService.getDietBookById(this.dietId).subscribe((book) => {
      //   this.dietBook = book;
      // });
      if (this.mealId === undefined) {
        this.route.queryParams.subscribe((params) => {
          this.dietId = params["dietId"];
          this.dietBookService
            .getDietBookById(this.dietId)
            .subscribe((dietbook) => {
              if (dietbook.meal) {
                this.mealIds = dietbook.meal.map((m) => m);

                this.loadMeals();
              }
            });
        });
      } else if (this.mealId !== "addMeal" || undefined) {
        this.mealService
          .getAllMeat()
          .pipe(
            map((meals) =>
              meals.filter((meal) => this.mealIds.includes(meal.id))
            )
          )
          .subscribe((filteredMeals) => {
            this.meals = filteredMeals;
          });

        if (this.activeButton > 0) {
          this.onClickButton(this.activeButton);
        }
      }
    });
  }
  onCloseMealFormClicked() {
    this.closeMealForm.emit();
  }

  //charge les meals selon le livret dans array
  loadMeals(): void {
    this.dietBookService.getDietBookById(this.dietId).subscribe((book) => {
      this.dietBook = book;
      if (book.meal) {
        this.mealIds = book.meal.map((m) => m);

        // Charger les repas correspondants
        this.mealService.getAllMeat().subscribe((allMeals) => {
          this.meals = allMeals.filter((meal) =>
            this.mealIds.includes(meal.id)
          );

          // Mettre à jour l'affichage des repas en fonction du bouton actif
          if (this.activeButton) {
            this.onClickButton(this.activeButton);
          }
        });
      }
    });
  }

  //défini le nombre d'étape pour afficher les boutons de sélection des Meals par semaine
  getRange(stage: number): number[] {
    return Array(stage)
      .fill(0)
      .map((_, index) => index + 1);
  }

  //renomme les collations am-pm1-pm2
  getMealSortName(meal: Meal) {
    let name = meal.typeMeal;
    let collation = meal.collation;

    if (meal.typeMeal === "Collation") {
      name += "-" + collation;
    }

    return name;
  }

  // filtre les meals à afficher pour la semaine délectionnée
  onClickButton(buttonNum: number) {
    this.activeButton = buttonNum;

    this.MealsToDisplay = this.meals.filter((filterStage) => {
      return filterStage.stage.includes(buttonNum);
    });
    this.MealsToDisplay.sort((a, b) => {
      let nameA = this.getMealSortName(a);
      let nameB = this.getMealSortName(b);

      return this.mealOrder.indexOf(nameA) - this.mealOrder.indexOf(nameB);
    });
  }

  //accède au livret pour modification des données
  onModify() {
    this.router.navigateByUrl(`/modify-diet_book?dietId=${this.dietId}`);
  }

  // ajoute un nouveau meal au livret
  onAddMeal() {
    this.router.navigateByUrl(`dietbook?dietId=${this.dietId}&mealId=addMeal`);
  }
  //remet la variable activeButtonMeal à 0 pour désactiver le meal sélectionné. ne fonctionne pas
  onMealFormCancel() {
    console.log("annulation reçue dans singleDiet");
    this.activeButtonMeal = "0";
  }

  //accède au meal sélectionné par son id
  onViewMealForm(id: string) {
    this.activeButtonMeal = id;
    this.router.navigateByUrl(`dietbook?dietId=${this.dietId}&mealId=${id}`);
  }
}
