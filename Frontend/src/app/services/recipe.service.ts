import { Injectable } from "@angular/core";
import { Recipe } from "../models/recipe.model";
import { AuthService } from "./auth.service";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Observable, Subject, switchMap, map, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class RecipeService {
  recipes$ = new Subject<Recipe[]>();

  constructor(private http: HttpClient, private auth: AuthService) {}

  getAllRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(
      `http://localhost:5400/api/recipes?timestamp=${new Date().getTime()}`
    );
  }

  getRecipeById(id: string): Observable<Recipe> {
    return this.http.get<Recipe>(
      `http://localhost:5400/api/recipes/${id}?timestamp=${new Date().getTime()}`
    );
  }

  modifyRecipe(id: string, recipe: Recipe) {
    return this.http
      .put<{ message: string }>(
        `http://localhost:5400/api/recipes/modify_recipe/${id}`,
        recipe
      )
      .pipe(catchError((error) => throwError(error.error.message)));
  }

  addRecipe(formValue: {
    id: string;
    title: string;
    dietbookIds: number[];
    ingredients: string[];
    recipe: string[];
    preparationTime: number;
    breakTime: number;
    cookingTime: number;
    online: boolean;
    customerId: string[];
  }): Observable<Recipe> {
    return this.getAllRecipes().pipe(
      map((recipes) => ({
        ...formValue,
      })),
      switchMap((newRecipe) =>
        this.http.post<Recipe>(
          "http://localhost:5400/api/recipes/add_recipe",
          newRecipe
        )
      )
    );
  }
}
