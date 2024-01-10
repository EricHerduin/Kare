import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomepageComponent } from "./page/homepage/homepage.component";
import { DietListComponent } from "./livrets/diet/diet-list/diet-list.component";
import { DietFormComponent } from "./livrets/diet/diet-form/diet-form.component";
import { SingleDietComponent } from "./livrets/diet/single-diet/single-diet.component";
import { RecipeListComponent } from "./livrets/recipe/recipe-list/recipe-list.component";
import { RecipeFormComponent } from "./livrets/recipe/recipe-form/recipe-form.component";
import { SingleRecipeComponent } from "./livrets/recipe/single-recipe/single-recipe.component";
import { SportListComponent } from "./livrets/sport/sport-list/sport-list.component";
import { SportFormComponent } from "./livrets/sport/sport-form/sport-form.component";
import { SingleSportComponent } from "./livrets/sport/single-sport/single-sport.component";
import { LoginComponent } from "./auth/login/login.component";
import { AuthGuard } from "./services/auth-guard.service";

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "home", component: SingleRecipeComponent, canActivate: [AuthGuard] },
  { path: "homepage", component: HomepageComponent, canActivate: [AuthGuard] },
  { path: "dietbooks", component: DietListComponent, canActivate: [AuthGuard] },

  {
    path: "recipebooks",
    component: RecipeListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "sportbooks",
    component: SportListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "dietbook",
    component: SingleDietComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "recipebook",
    component: RecipeFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "sportbook",
    component: SingleSportComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "add_diet_book",
    component: DietFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "modify-diet_book",
    component: DietFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "add_recipe_book",
    component: RecipeFormComponent,
    canActivate: [AuthGuard],
  },

  {
    path: "sportbook/add_sport_book",
    component: SportFormComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
