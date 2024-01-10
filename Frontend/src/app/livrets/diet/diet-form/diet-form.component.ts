import { Component, NgModule, OnInit } from "@angular/core";
import { ConfirmationDialogComponent } from "src/app/core/confirmation-dialog/confirmation-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { DietBooksService } from "src/app/services/diet-book.service";
import { mealService } from "src/app/services/meal.service";
import { DietBook } from "src/app/models/diet.model";
import { Meal } from "src/app/models/meal.model";
import { StageToRemove } from "src/app/models/dialog-data.model";
import { Observable, catchError, EMPTY } from "rxjs";
import { map, switchMap, tap } from "rxjs/operators";
import { MatRadioModule } from "@angular/material/radio";
import { MessageService } from "src/app/services/snackBar.service";

@Component({
  selector: "app-diet-form",
  templateUrl: "./diet-form.component.html",
  styleUrls: ["./diet-form.component.scss"],
})
export class DietFormComponent implements OnInit {
  dietBookForm!: FormGroup;
  dietMealForm!: FormGroup;
  errorMsg!: string;
  mode!: string;
  dietBookId!: string;
  loading!: Boolean;
  dietBook!: DietBook;
  dietBook$!: Observable<DietBook>;
  myPathologies!: any[];
  selectedPathology!: string;
  messageStage!: Boolean;
  dialogRef!: any;
  mealIds!: Array<string>;
  meals!: Meal[];
  buttonCreate: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private dietBooks: DietBooksService,
    private dietMeals: mealService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.myPathologies = [
      { id: 1, name: "Sans pathologie" },
      { id: 2, name: "Anémie" },
      { id: 3, name: "Athérosclérose/thrombose" },
      { id: 4, name: "Cholestérol" },
      { id: 5, name: "Diabète" },
      { id: 6, name: "Femme enceinte" },
      { id: 7, name: "Hypertension" },
      { id: 8, name: "Hyperthyroïdie" },
      { id: 9, name: "Hypothyroïdie" },
      { id: 10, name: "Lombalgie/lumbago" },
      { id: 11, name: "Maladie de cœliaque" },
      { id: 12, name: "Maladie de crohn" },
      { id: 13, name: "Maladie hépatique/hépatite" },
      { id: 14, name: "Ménopause" },
      { id: 15, name: "Ostéoporose" },
      { id: 16, name: "Perte de poids rapide" },
      { id: 17, name: "Post infarctus" },
      { id: 18, name: "Sarcopénie" },
      { id: 19, name: "Sédentaire" },
      { id: 20, name: "Spondylarthrite" },
      { id: 21, name: "Sportif : activités endurantes" },
      { id: 22, name: "Sportif: activité de force" },
      { id: 23, name: "Triglycérides" },
      { id: 24, name: "Urée" },
    ];

    this.loading = true;
    this.dietBookId = this.route.snapshot.queryParams["dietId"];

    this.route.queryParams
      .pipe(
        switchMap((params) => {
          if (!this.dietBookId) {
            this.mode = "new";
            this.initEmptyForm();
            this.buttonCreate = true;
            this.loading = false;
            return EMPTY;
          } else {
            this.mode = "edit";
            console.log(this.dietBooks.getDietBookById(params["dietId"]));
            return this.dietBooks.getDietBookById(params["dietId"]);
          }
        }),
        tap((dietbook) => {
          if (dietbook) {
            this.dietBook = dietbook;
            console.log("voici le dietbook ", this.dietBook);
            this.initModifiyForm(dietbook);
            this.loading = false;
          }
        }),
        catchError((error) => (this.errorMsg = JSON.stringify(error)))
      )
      .subscribe();
  }

  initEmptyForm() {
    this.dietBookForm = this.formBuilder.group({
      title: new FormControl("", Validators.required),
      pathology: new FormControl("", Validators.required),
      sexe: new FormControl(""),
      nbStage: new FormControl("4"),
      nbWeekPerStage: new FormControl("3"),
      description: new FormControl(""),
      id: new FormControl("0"),
      online: new FormControl(false), // Initialiser à false (hors ligne)
    });
  }

  initModifiyForm(dietbook: DietBook) {
    this.dietBookForm = this.formBuilder.group({
      id: dietbook.id,
      title: dietbook.title,
      pathology: dietbook.pathology,
      nbStage: dietbook.nbStage,
      nbWeekPerStage: dietbook.nbWeekPerStage,
      description: dietbook.description,
      online: dietbook.online,
      sexe: dietbook.sexe,
    });
    this.selectedPathology = this.dietBookForm.get("pathology")!.value;
  }
  openConfirmationDialog(): void {
    let message = "Êtes-vous sûr de vouloir modifier ce livret ?";
    let stagesToRemove: StageToRemove[] = [];
    let diffMessage = "";
    if (this.dietBook.nbStage > this.dietBookForm.get("nbStage")!.value) {
      const difference =
        this.dietBook.nbStage - this.dietBookForm.get("nbStage")!.value;
      if (difference > 1) {
        diffMessage =
          "Sélectionnez les " + difference + " étapes à supprimer\n";
      } else {
        diffMessage = "Sélectionnez l'étape à supprimer\n";
      }
      message =
        "Le nombre d'étape a diminué.\n En validant, les étapes seront supprimées des repas.\n " +
        diffMessage +
        message;

      // Création d'une instance de StageToRemove pour chaque étape
      for (let i = 1; i <= this.dietBook.nbStage; i++) {
        stagesToRemove.push({ value: i, selected: false });
      }
    }

    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: "500px",
      data: { message: message, stagesToRemove: stagesToRemove },
      panelClass: "custom-dialog-container",
    });

    this.dialogRef.afterClosed().subscribe((result: StageToRemove[]) => {
      if (result) {
        if (this.dietBook.nbStage > this.dietBookForm.get("nbStage")!.value) {
          const StageToRemoveSelected = stagesToRemove.filter(
            (stage) => stage.selected === true
          );

          // Supprimer les étapes des repas
          this.onSubmitFormStageChanged(
            result,
            StageToRemoveSelected,
            this.dietBook.nbStage
          );
          this.onSubmitForm();
        } else {
          // Mettre à jour normalement
          this.onSubmitForm();
        }
      }
    });
  }

  onSubmitForm() {
    this.loading = true;
    const newDietBook = new DietBook();
    newDietBook.title = this.dietBookForm.get("title")!.value;
    newDietBook.pathology = this.dietBookForm.get("pathology")!.value;
    newDietBook.nbStage = this.dietBookForm.get("nbStage")!.value;
    newDietBook.nbWeekPerStage = this.dietBookForm.get("nbWeekPerStage")!.value;
    newDietBook.description = this.dietBookForm.get("description")!.value;
    newDietBook.sexe = this.dietBookForm.controls["sexe"].value;
    newDietBook.online = this.dietBookForm.get("online")!.value;
    console.log(newDietBook);
    if (this.mode === "new") {
      this.dietBooks
        .addDietBook(this.dietBookForm.value)
        .pipe(
          tap(() => {
            this.loading = false;
            this.messageService.showMessage(
              "le Livret d'Equilibrage alimentaire a bien été créé"
            );
            this.router.navigateByUrl(`dietbooks`);
          }),
          catchError((error) => {
            console.error(error);
            this.loading = false;
            this.messageService.showErrorMessage(
              "Une erreur s'est produite lors de la création."
            );
            this.errorMsg = error.message;
            return EMPTY;
          })
        )
        .subscribe();
    } else if (this.mode === "edit") {
      this.dietBooks
        .modifyDietBook(this.dietBookId, this.dietBookForm.value)
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
  }
  onSubmitFormStageChanged(
    result: any,
    StageToRemoveSelected: any,
    newNbStage: any
  ) {
    StageToRemoveSelected = StageToRemoveSelected.sort(
      (a: any, b: any) => b.value - a.value
    );
    this.dietBooks.getDietBookById(this.dietBookId).subscribe((dietbook) => {
      if (dietbook.meal?.length === 0) {
        return;
      }
      if (dietbook.meal) {
        const mealList = dietbook.meal.map((m) => m);
        this.dietMeals
          .getAllMeat()
          .pipe(
            map((meals) => meals.filter((meal) => mealList.includes(meal.id)))
          )
          .subscribe((meals) => {
            let mealToRemoved = meals.filter((meal) =>
              StageToRemoveSelected.some((stage: any) =>
                meal.stage.includes(stage.value)
              )
            );
            mealToRemoved.forEach((element) => {
              let arrStage: number[] = element.stage.map((m) => m);
              const stageToRemove = StageToRemoveSelected.map(
                (item: any) => item.value
              );
              for (const numToremove of stageToRemove) {
                const indexToRemove = arrStage.indexOf(numToremove);
                if (indexToRemove === -1) {
                  arrStage = arrStage.map((item) =>
                    item >= numToremove ? item - 1 : item
                  );
                } else if (indexToRemove !== -1) {
                  arrStage.splice(indexToRemove, 1);

                  arrStage = arrStage.map((item) =>
                    item > numToremove ? item - 1 : item
                  );
                }
                if (arrStage.length === 0) {
                  this.dietMeals.deleteMeal(element.id).subscribe();
                }
              }
              const updatedMeal: Meal = {
                ...element,
                stage: arrStage,
              };

              this.dietMeals
                .modifyDietMeal(element.id, updatedMeal)
                .subscribe();
              console.log("arrStage final du dietMeal", element.id, arrStage);
              return arrStage;
            });
          });
      }
    });
    this.router.navigateByUrl(`dietbook?dietId=${this.dietBookId}`);
  }
}
// const remainingStages = element.stage;

// const IndexToChange = remainingStages.indexOf(stageNb);

// if (
//   stageIndex === -1 &&
//   IndexToChange < remainingStages.length
// ) {
//   for (
//     let i = IndexToChange;
//     i < remainingStages.length;
//     i++
//   ) {
//     const valueStage = remainingStages[i];
//     remainingStages[i] = valueStage - 1;
//   }
// }
// element.stage.splice(stageIndex, 1);
// // console.log("le nouvel élément est :", element.stage);
// // const remainingStagesNew = element.stage;

// for (let i = IndexToChange; i < remainingStages.length; i++) {
//   const valueStage = remainingStages[i];
//   remainingStages[i] = valueStage - 1;
// }
// console.log(
//   "Nouveau tableau des stages du dietMeal :",
//   remainingStages
// );
//                 }
//               });
//             });
//           });
//       }
//     });
//   }
// }

// StageToRemoveSelected.forEach((stage: any) => {
//   const { value: stageNb } = stage;
//   console.log("for Each stageNB :", stageNb);
//   mealToRemoved.forEach((element) => {
//     const elementStage = element.stage;
//     console.log(
//       "--------------------",
//       "l'id du DietMeal est = ",
//       element.id,
//       " et son stage est : ",
//       element.stage
//     );
//     const stageIndex = element.stage.indexOf(stageNb);
//     console.log("stageIndex", stageIndex);

//     if (stageIndex !== -1) {
//       element.stage.splice(stageIndex, 1);
//       console.log("l'élément est :", element);

//       const remainingStages = element.stage;
//       console.log("remainingStages Avant modif :", remainingStages);

//       const maxStageNumber = Math.max(...remainingStages);
//       // Ajuster la longueur du tableau
//       const newLength =
//         elementStage.length - StageToRemoveSelected.length;
//       remainingStages.length =
//         newLength < 0 ? maxStageNumber : newLength;
//       if (stageIndex === 0) {
//         console.log("le meal va être supprimé");
//       } else if (stageIndex != -1) {
//         for (let i = 0; i < remainingStages.length; i++) {
//           remainingStages[i] = i + 1;
//         }
//       } else {
//         for (
//           let i = stageIndex - 1;
//           i < remainingStages.length;
//           i++
//         ) {
//           remainingStages[i] = i + 1;
//         }
//       }

//       console.log(
//         "Stages restants après renumérotation :",
//         remainingStages
//       );
//     }
//   });
//   console.log("les modifs", mealToRemoved);
// });

// Mettez à jour votre variable avec les modifications nécessaires ici
// Par exemple, this.maVariable = remainingStages;
// });
// }

// }
//     this.dietBooks
//       .addDietBook(this.dietBookForm.value)
//       .pipe(tap(() => this.router.navigateByUrl("dietBooks/add_diet_book")))
//       .subscribe;
//   }
// }

// textheader!: string;

// dietBookForm!: FormGroup;
// mode!: string;
// loading!: boolean;
// dietBook!: DietBook;
// errorMsg!: string;

// constructor(
//   private formBuilder: FormBuilder,
//   private route: ActivatedRoute,
//   private router: Router,
//   private dietBooks: DietBooksService,
//   private auth: AuthService
// ) {}

// ngOnInit() {
//   this.textheader = "Saisie des Livrets Diet";
//   this.loading = true;
//   this.route.params
//     .pipe(
//       switchMap((params) => {
//         if (!params["id"]) {
//           this.mode = "new";
//           this.initEmptyForm();
//           this.loading = false;
//           return EMPTY;
//         } else {
//           this.mode = "edit";
//           return this.dietBooks.getDietBookById(params["id"]);
//         }
//       }),
//       tap((dietBook) => {
//         if (dietBook) {
//           this.dietBook = dietBook;
//           this.initModifiyForm(dietBook);
//           this.loading = false;
//         }
//       }),
//       catchError((error) => (this.errorMsg = JSON.stringify(error)))
//     )
//     .subscribe();
// }

// initEmptyForm() {
//   this.dietBookForm = this.formBuilder.group({
//     name: [null, Validators.required],
//     pathology: [null, Validators.required],
//     nbStage: [null, Validators.required],
//     nbWeekPerStage: [null, Validators.required],
//     description: [null, Validators.required],
//     meal: [null]
//   });
// }

// initModifiyForm(dietBook: DietBook) {
//   this.dietBookForm = this.formBuilder.group({
//     name: [dietBook.name, Validators.required],
//     pathology: [dietBook.pathology, Validators.required],
//     nbStage: [dietBook.nbStage, Validators.required],
//     nbWeekPerStage: [dietBook.nbWeekPerStage, Validators.required],
//     description: [dietBook.description, Validators.required],
//   });
// }

// onSubmit() {
//   this.loading = true;
//   const newDietBook = new DietBook();
//   newDietBook.name = this.dietBookForm.get("name")!.value;
//   newDietBook.pathology = this.dietBookForm.get("pathology")!.value;
//   newDietBook.nbStage = this.dietBookForm.get("nbStage")!.value;
//   newDietBook.nbWeekPerStage = this.dietBookForm.get("nbWeekPerStage")!.value;
//   newDietBook.description = this.dietBookForm.get("description")!.value;
//   if (this.mode === "new") {
//     this.dietBooks
//       .createDietBook(newDietBook)
//       .pipe(
//         tap(({ message }) => {
//           console.log(message);
//           this.loading = false;
//           this.router.navigate(["/dietBooks"]);
//         }),
//         catchError((error) => {
//           console.error(error);
//           this.loading = false;
//           this.errorMsg = error.message;
//           return EMPTY;
//         })
//       )
//       .subscribe();
// } else if (this.mode === "edit") {
//   this.dietBooks
//   .modifyDietBook(
//     this.dietBook._id,
//     newDietBook,
//   )
//   .pipe(
//     tap(({ message }) => {
//       console.log(message);
//       this.loading = false;
//       this.router.navigate(["/dietbooks"]);
//     }),
//     catchError((error) => {
//       console.error(error);
//       this.loading = false;
//       this.errorMsg = error.message;
//       return EMPTY;
//     })
//   )
//   .subscribe();
// }
