import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./header/header.component";
import { LoginComponent } from "./auth/login/login.component";
import { DietFormComponent } from "./livrets/diet/diet-form/diet-form.component";
import { SingleDietComponent } from "./livrets/diet/single-diet/single-diet.component";
import { DietListComponent } from "./livrets/diet/diet-list/diet-list.component";
import { SingleRecipeComponent } from "./livrets/recipe/single-recipe/single-recipe.component";
import { RecipeListComponent } from "./livrets/recipe/recipe-list/recipe-list.component";
import { RecipeFormComponent } from "./livrets/recipe/recipe-form/recipe-form.component";
import { SportListComponent } from "./livrets/sport/sport-list/sport-list.component";
import { SportFormComponent } from "./livrets/sport/sport-form/sport-form.component";
import { SingleSportComponent } from "./livrets/sport/single-sport/single-sport.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { AuthInterceptor } from "./interceptors/auth-interceptor";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatRadioModule } from "@angular/material/radio";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MealListComponent } from "./livrets/diet/meal-list/meal-list.component";

import { MealformComponent } from "./livrets/diet/mealform/mealform.component";
import { ArrayDietmealComponent } from "./core/array-dietmeal/array-dietmeal.component";
import { ConfirmationDialogComponent } from "./core/confirmation-dialog/confirmation-dialog.component";
import { StageSelectionDialogComponent } from "./core/stage-selection-dialog/stage-selection-dialog.component";
import { HomepageComponent } from "./page/homepage/homepage.component";
import { AutofocusDirective } from "./directive/autofocus.directive";
import { FileUploadComponent } from './core/file-upload/file-upload.component';
import { ArrayRecipeComponent } from './core/array-recipe/array-recipe.component';

@NgModule({
  declarations: [
    AppComponent,
    AutofocusDirective,
    HeaderComponent,
    LoginComponent,
    DietFormComponent,
    SingleDietComponent,
    DietListComponent,
    SingleRecipeComponent,
    RecipeListComponent,
    RecipeFormComponent,
    SportListComponent,
    SportFormComponent,
    SingleSportComponent,
    MealListComponent,
    MealformComponent,
    ArrayDietmealComponent,
    ConfirmationDialogComponent,
    StageSelectionDialogComponent,
    HomepageComponent,
    FileUploadComponent,
    ArrayRecipeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatRadioModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSlideToggleModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
