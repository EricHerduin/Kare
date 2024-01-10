import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  NgModule,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  FormArray,
} from "@angular/forms";
import { ConfirmationDialogComponent } from "src/app/core/confirmation-dialog/confirmation-dialog.component";
import { ActivatedRoute, Router } from "@angular/router";
import { mealService } from "src/app/services/meal.service";
import { Meal } from "src/app/models/meal.model";
import { Observable, catchError, EMPTY } from "rxjs";
import { map, switchMap, tap } from "rxjs/operators";
import { MatRadioModule } from "@angular/material/radio";
import { MatCheckbox } from "@angular/material/checkbox";
import { DietBook } from "src/app/models/diet.model";
import { DietBooksService } from "src/app/services/diet-book.service";
import { MessageService } from "src/app/services/snackBar.service";
import { AutofocusDirective } from "src/app/directive/autofocus.directive";

@Component({
  selector: "app-mealform",
  templateUrl: "./mealform.component.html",
  styleUrls: ["./mealform.component.scss"],
})
export class MealformComponent implements OnInit {
  dietMealForm!: FormGroup;
  collationListControls: FormControl[] = [];
  dietMeal!: Meal;
  errorMsg!: string;
  mode!: string;
  mealId!: string;
  dietBookId!: string;
  loading!: Boolean;
  dietBook!: DietBook;
  dietBook$!: Observable<DietBook>;
  selectedOption!: string;
  checkAll!: boolean;
  selectedStages!: number[];
  textCheckAll!: string;
  stageNb!: number;
  activeButton!: number;
  meals: string[] = ["Petit-déjeuner", "Collation", "Déjeuner", "Diner"];
  dialogRef!: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private dietBooks: DietBooksService,
    private mealService: mealService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private messageService: MessageService
  ) {}
  @Output() cancelClicked: EventEmitter<void> = new EventEmitter<void>();

  ngOnInit() {
    this.loading = true;
    this.checkAll = false;
    this.selectedStages = [];
    this.initEmptyForm();
    this.route.queryParams
      .pipe(
        switchMap((params) => {
          this.mealId = params["mealId"];
          this.dietBookId = params["dietId"];
          this.dietBooks.getDietBookById(this.dietBookId).subscribe((book) => {
            this.stageNb = book.nbStage;
          });
          if (this.mealId === "addMeal") {
            this.mode = "new";
            this.selectedStages = [];
            this.initEmptyForm();

            this.loading = false;
            return EMPTY;
          } else {
            this.mode = "edit";

            this.initEmptyForm();
            return this.mealService.getMealById(params["mealId"]);
          }
        }),
        tap((dietMeal) => {
          if (dietMeal) {
            this.dietMeal = dietMeal;
            this.selectedOption = dietMeal.typeMeal;
            this.selectedStages = dietMeal.stage.map((k) => Number(k));
            this.initModifiyForm(dietMeal);
          }
        }),
        catchError((error) => (this.errorMsg = JSON.stringify(error)))
      )
      .subscribe();
  }

  onClickButtonMeal(name: string) {
    this.selectedOption = name;
    this.dietMealForm.patchValue({
      typeMeal: name,
    });
  }
  getRange(stage: number): number[] {
    return Array(stage)
      .fill(0)
      .map((_, index) => index + 1);
  }

  toggleCheckAll() {
    this.checkAll = !this.checkAll;

    this.textCheckAll = this.checkAll
      ? "Tout désélectionner"
      : "Tout sélectionner";

    // Réinitialiser le tableau
    this.selectedStages = [];

    // Générer un tableau de 0 à stageNb
    const stagesRange = Array.from(Array(this.stageNb).keys());

    // Transformer en tableau de nombres
    const stagesNumbers = stagesRange.map((num) => Number(num + 1));
    console.log(stagesNumbers, this.checkAll);
    // Assigner selon le statut de checkAll
    this.selectedStages = this.checkAll ? stagesNumbers : [];
  }

  onCheckBoxChange(num: number, event: Event) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedStages.push(num);
    } else {
      const index = this.selectedStages.indexOf(num);
      if (index > -1) {
        this.selectedStages.splice(index, 1);
      }
    }
  }
  showMeal() {
    if (this.selectedOption === "Déjeuner" || this.selectedOption === "Diner") {
      return true;
    } else {
      return false;
    }
  }

  initEmptyForm() {
    this.dietMealForm = this.formBuilder.group({
      typeMeal: new FormControl(""),
      collation: new FormControl(""),
      stage: new FormControl([], Validators.required),
      meat: new FormControl(""),
      meatQuantity: new FormControl("180"),
      meatList: new FormControl(""),
      sauce: new FormControl("1"),
      sideDish: new FormControl(""),
      sideDishQuantity: new FormControl("4-5"),
      sideDishList: new FormControl(""),
      drink: new FormControl(""),
      obs: new FormControl(""),
      dietBookId: new FormControl(`${this.dietBookId}`),
      id: new FormControl("0"),
      collationList: this.formBuilder.array([]),
    });
    this.textCheckAll = "Tout sélectionner";
  }
  initModifiyForm(meal: Meal) {
    this.dietMealForm = this.formBuilder.group({
      id: meal.id,
      typeMeal: meal.typeMeal,
      collation: meal.collation,
      collationList: this.formBuilder.array(meal.collationList),
      stage: [meal.stage],
      meat: meal.meat,
      meatQuantity: meal.meatQuantity,
      meatList: meal.meatList,
      sauce: meal.sauce,
      sideDish: meal.sideDish,
      sideDishQuantity: meal.sideDishQuantity,
      sideDishList: meal.sideDishList,
      drink: meal.drink,
      obs: meal.obs,
    });

    if (this.selectedStages.length === this.stageNb) {
      this.textCheckAll = "Tout déselectionner";
    } else {
      this.textCheckAll = "Tout sélectionner";
    }
    if (meal.collationList && meal.collationList.length > 0) {
      const collationArray = this.dietMealForm.get(
        "collationList"
      ) as FormArray;
      this.collationListControls = collationArray.controls.map(
        (control) => control as FormControl
      );

      meal.collationList.forEach((collation, index) => {
        this.collationListControls[index].setValue(collation);
      });
    }
  }

  onCancel() {
    this.cancelClicked.emit;
    console.log("annulation dans mealForm");
    this.router.navigateByUrl(`dietbook?dietId=${this.dietBookId}`);
  }
  openConfirmationDialog() {
    let message =
      "Êtes-vous sûr de vouloir supprimer ce repas ?<br> cela entraînera la suppression définitive du repas et dans tous les semaines qui lui sont associées.";
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: "500px",
      data: { message: message },
      panelClass: "custom-dialog-container",
    });

    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.mealService
          .deleteMeal(this.mealId)
          .pipe(
            tap(() => {
              this.loading = false;
              this.messageService.showMessage(
                "Les Modifications sont bien enregistrées"
              );
              this.router.navigateByUrl(`dietbook?dietId=${this.dietBookId}`);
            }),
            catchError((error) => {
              console.error(error);
              this.loading = false;
              this.messageService.showErrorMessage(
                "Une erreur s'est produite lors de la modification."
              );
              this.errorMsg = error.message;
              return EMPTY;
            })
          )
          .subscribe();
      }
    });
  }

  addCollation() {
    const newCollationControl = this.formBuilder.control("");
    this.collationListControls.push(newCollationControl);
    (this.dietMealForm.get("collationList") as FormArray).push(
      newCollationControl
    );
  }

  removeCollation(index: number) {
    this.collationListControls.splice(index, 1);
    (this.dietMealForm.get("collationList") as FormArray).removeAt(index);
  }

  onSubmitForm() {
    this.loading = true;
    if (this.dietMealForm.value.stage !== this.selectedStages) {
      this.dietMealForm.patchValue({ stage: [] });
    }
    this.dietMealForm.patchValue({
      stage: this.selectedStages.sort((a, b) => a - b),
    });
    if (this.dietMealForm.value.typeMeal !== "Collation") {
      this.dietMealForm.patchValue({ collation: "" });
    }
    const collationListValues = this.collationListControls.map(
      (control) => control.value
    );

    const newDietMeal = {
      id: this.dietMealForm.get("id")!.value,
      typeMeal: this.dietMealForm.get("typeMeal")!.value,
      collation: this.dietMealForm.get("collation")!.value,
      collationList: collationListValues,
      stage: this.dietMealForm.get("stage")!.value,
      meat: this.dietMealForm.get("meat")!.value,
      meatList: this.dietMealForm.get("meatList")!.value,
      meatQuantity: this.dietMealForm.get("meatQuantity")!.value,
      sauce: this.dietMealForm.get("sauce")!.value,
      sideDish: this.dietMealForm.get("sideDish")!.value,
      sideDishQuantity: this.dietMealForm.get("sideDishQuantity")!.value,
      sideDishList: this.dietMealForm.get("sideDishList")!.value,
      drink: this.dietMealForm.get("drink")!.value,
      obs: this.dietMealForm.get("obs")!.value,
      dietBookId: this.dietBookId,
    };

    if (this.mode === "new") {
      this.mealService
        .addMeal(newDietMeal)
        .pipe(
          tap(() => {
            this.loading = false;
            this.messageService.showMessage("Le repas a bien été créé");
            this.router.navigateByUrl(`dietbook?dietId=${this.dietBookId}`);
          }),
          catchError((error) => {
            console.error(error);
            this.loading = false;
            this.messageService.showErrorMessage(
              "Une erreur est survenue lors de la création"
            );
            this.errorMsg = error.message;
            return EMPTY;
          })
        )
        .subscribe();
    } else if (this.mode === "edit") {
      this.mealService
        .modifyDietMeal(this.mealId, newDietMeal)
        .pipe(
          tap(() => {
            this.loading = false;
            this.messageService.showMessage("Le repas a bien été modifié");
            this.router.navigateByUrl(`dietbook?dietId=${this.dietBookId}`);
          }),
          catchError((error) => {
            console.error(error);
            this.loading = false;
            this.messageService.showErrorMessage(
              "Une erreur est survenue lors de la modification"
            );
            this.errorMsg = error.message;
            return EMPTY;
          })
        )
        .subscribe();
    }
  }
}
