import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { Recipe } from "src/app/models/recipe.model";
import { RecipeService } from "src/app/services/recipe.service";
import { SharedService } from "src/app/services/shared.service";

@Component({
  selector: "app-recipe-list",
  templateUrl: "./recipe-list.component.html",
  styleUrls: ["./recipe-list.component.scss"],
})
export class RecipeListComponent implements OnInit {
  recipes$!: Observable<Recipe[]>;
  showElement!: boolean;

  constructor(
    private router: Router,
    private recipe: RecipeService,
    private route: ActivatedRoute,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    this.recipes$ = this.recipe.getAllRecipes();
    this.sharedService.setTextHeader("Liste des Recettes");
  }

  onViewRecipe(recipeId: string) {
    this.router.navigateByUrl(`recipebook?recipeId=${recipeId}`);
  }

  onNewRecipe() {
    this.router.navigateByUrl("add_recipe_book");
  }
}
