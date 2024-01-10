import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormArray,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, EMPTY, catchError } from "rxjs";
import { tap, map, switchMap } from "rxjs/operators";
import { Recipe } from "src/app/models/recipe.model";
import { DietBooksService } from "src/app/services/diet-book.service";
import { RecipeService } from "src/app/services/recipe.service";
import { SharedService } from "src/app/services/shared.service";
import { MessageService } from "src/app/services/snackBar.service";

@Component({
  selector: "app-recipe-form",
  templateUrl: "./recipe-form.component.html",
  styleUrls: ["./recipe-form.component.scss"],
})
export class RecipeFormComponent implements OnInit {
  recipeForm!: FormGroup;
  errorMsg!: string;
  mode!: string;
  recipeId!: string;
  loading!: boolean;
  recipeBook!: Recipe;
  recipeBook$!: Observable<Recipe>;
  ingredientListControls: FormControl[] = [];
  recipeListControls: FormControl[] = [];
  dietbookListControls: FormControl[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private dietBooks: DietBooksService,
    private sharedService: SharedService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.recipeId = this.route.snapshot.queryParams["recipeId"];

    this.route.queryParams
      .pipe(
        switchMap((params) => {
          if (!this.recipeId) {
            this.mode = "new";
            this.loading = false;
            this.initEmptyForm();
            this.sharedService.setTextHeader(`Nouvelle Recette`);
            return EMPTY;
          } else {
            this.mode = "edit";
            this.sharedService.setTextHeader(`Recette N° ${this.recipeId}`);
            return this.recipeService.getRecipeById(params["recipeId"]);
          }
        }),
        tap((recipe) => {
          if (recipe) {
            this.recipeBook = recipe;
            console.log(this.recipeBook);
            this.loading = false;
            this.initModifyForm(this.recipeBook);
          }
        }),
        catchError((error) => (this.errorMsg = JSON.stringify(error)))
      )
      .subscribe();
  }

  initEmptyForm() {
    this.recipeForm = this.formBuilder.group({
      title: new FormControl("", Validators.required),
      dietBookIds: this.formBuilder.array([]),
      ingredients: this.formBuilder.array([]),
      recipe: this.formBuilder.array([]),
      preparationTime: new FormControl(null),
      cookingTime: new FormControl(null),
      breakTime: new FormControl(null),
      pics: new FormControl(null),
      online: new FormControl(false),
      customerId: new FormControl(null),
      id: new FormControl(0),
    });
  }
  addIngredient() {
    const newIngredientControl = this.formBuilder.control("");
    this.ingredientListControls.push(newIngredientControl);
    (this.recipeForm.get("ingredients") as FormArray).push(
      newIngredientControl
    );
  }

  removeIngredient(index: number) {
    this.ingredientListControls.splice(index, 1);
    (this.recipeForm.get("ingredients") as FormArray).removeAt(index);
  }

  addRecipe() {
    const newRecipeControl = this.formBuilder.control("");
    this.recipeListControls.push(newRecipeControl);
    (this.recipeForm.get("recipe") as FormArray).push(newRecipeControl);
  }

  removeRecipe(index: number) {
    this.recipeListControls.splice(index, 1);
    (this.recipeForm.get("recipe") as FormArray).removeAt(index);
  }

  addDietbook() {
    const newDietbookControl = this.formBuilder.control("");
    this.dietbookListControls.push(newDietbookControl);
    (this.recipeForm.get("dietbookIds") as FormArray).push(newDietbookControl);
  }

  removeDietbook(index: number) {
    this.dietbookListControls.splice(index, 1);
    (this.recipeForm.get("dietbookIds") as FormArray).removeAt(index);
  }

  initModifyForm(recipebook: Recipe) {
    this.recipeForm = this.formBuilder.group({
      id: recipebook.id,
      title: recipebook.title,
      dietbookIds: this.formBuilder.array(recipebook.dietbookIds),
      ingredients: this.formBuilder.array(recipebook.ingredients),
      recipe: this.formBuilder.array(recipebook.recipe),
      preparationTime: recipebook.preparationTime ?? 0,
      cookingTime: recipebook.cookingTime ?? 0,
      breakTime: recipebook.breakTime ?? 0,
      pics: recipebook.pics ?? null,
      online: !!recipebook.online ?? false,
      customerId: recipebook.customerId ?? [],
    });
    console.log("Recipe Form after Initialization: ", this.recipeForm.value);
  }
  onSubmitForm() {
    this.loading = true;
    // if (this.recipeForm.value.stage !== this.selectedStages) {
    //   this.dietMealForm.patchValue({ stage: [] });
    // }
    // this.dietMealForm.patchValue({
    //   stage: this.selectedStages.sort((a, b) => a - b),
    // });
    // if (this.dietMealForm.value.typeMeal !== "Collation") {
    //   this.dietMealForm.patchValue({ collation: "" });
    // }
    const ingredientsListValues = this.ingredientListControls.map(
      (control) => control.value
    );
    const recipesListValues = this.recipeListControls.map(
      (control) => control.value
    );
    const dietbooksListValues = this.dietbookListControls.map(
      (control) => control.value
    );

    const newRecipe = {
      id: this.recipeForm.get("id")!.value,
      title: this.recipeForm.get("title")!.value,
      dietbookIds: dietbooksListValues,
      ingredients: ingredientsListValues,
      recipe: recipesListValues,
      preparationTime: this.recipeForm.get("preparationTime")!.value,
      cookingTime: this.recipeForm.get("cookingTime")!.value,
      breakTime: this.recipeForm.get("breakTime")!.value,
      pics: this.recipeForm.get("pics")!.value,
      online: this.recipeForm.get("online")!.value,
      customerId: this.recipeForm.get("customerId")!.value,
    };

    if (this.mode === "new") {
      this.recipeService
        .addRecipe(newRecipe)
        .pipe(
          tap(() => {
            this.loading = false;
            this.messageService.showMessage("Le repas a bien été créé");
            this.router.navigateByUrl(`recipebooks`);
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
      this.recipeService
        .modifyRecipe(this.recipeId, newRecipe)
        .pipe(
          tap(() => {
            this.loading = false;
            this.messageService.showMessage("Le repas a bien été modifié");
            this.router.navigateByUrl(`recipebooks`);
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
