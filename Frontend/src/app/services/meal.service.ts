import { Meal } from "../models/meal.model";

import { HttpClient, HttpClientModule } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { Observable, Subject, throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class mealService {
  meal$ = new Subject<Meal>();

  constructor(private http: HttpClient, private auth: AuthService) {}

  getAllMeat(): Observable<Meal[]> {
    return this.http.get<Meal[]>(
      "http://localhost:5400/api/dietbooks/meals/all_meals"
    );
  }
  getMealById(mealId: string): Observable<Meal> {
    return this.http.get<Meal>(
      `http://localhost:5400/api/dietbooks/meal/${mealId}`
    );
  }
  deleteMeal(mealId: string): Observable<Meal> {
    return this.http.delete<Meal>(
      `http://localhost:5400/api/dietbooks/meal/${mealId}`
    );
  }
  modifyDietMeal(id: string, dietMeal: Meal) {
    return this.http
      .put<{ message: string }>(
        `http://localhost:5400/api/dietbooks/modify_meal/${id}`,
        dietMeal
      )
      .pipe(catchError((error) => throwError(error.error.message)));
  }

  addMeal(formValue: {
    typeMeal: string;
    collation: string;
    collationList: string[];
    stage: string[];
    meat: string;
    meatQuantity: string;
    meatList: string;
    sauce: number;
    sideDish: string;
    sideDishQuantity: string;
    sideDishList: string;
    drink: string;
    obs: string;
    dietBookId: string;
  }): Observable<Meal> {
    return this.getAllMeat().pipe(
      map((meal) => ({
        ...formValue,
      })),
      switchMap((newmeal) =>
        this.http.post<Meal>(
          "http://localhost:5400/api/dietbooks/meal/add_meal",
          newmeal
        )
      )
    );
  }
}
