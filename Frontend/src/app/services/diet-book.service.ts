import { Injectable } from "@angular/core";
import { catchError, Observable, of, Subject, throwError } from "rxjs";
import { map, switchMap, tap } from "rxjs/operators";
import { DietBook } from "../models/diet.model";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class DietBooksService {
  dietbooks$ = new Subject<DietBook[]>();

  constructor(private http: HttpClient, private auth: AuthService) {}

  getAllDietBooks(): Observable<DietBook[]> {
    return this.http.get<DietBook[]>("http://localhost:5400/api/dietbooks");
  }

  getDietBookById(id: string): Observable<DietBook> {
    return this.http.get<DietBook>(`http://localhost:5400/api/dietbooks/${id}`);
  }

  modifyDietBook(id: string, dietBook: DietBook) {
    return this.http
      .put<{ message: string }>(
        `http://localhost:5400/api/dietbooks/modify-diet_book/${id}`,
        dietBook
      )
      .pipe(catchError((error) => throwError(error.error.message)));
  }

  addDietBook(formValue: {
    id: string;
    title: string;
    pathology: string;
    sexe: string;
    nbStage: number;
    nbWeekPerStage: number;
    description: string;
    meal?: [string];
    customerId: [string];
    online: boolean;
  }): Observable<DietBook> {
    return this.getAllDietBooks().pipe(
      map((dietBooks) => ({
        ...formValue,
      })),
      switchMap((newDietBook) =>
        this.http.post<DietBook>(
          "http://localhost:5400/api/dietbooks/add_diet_book",
          newDietBook
        )
      )
    );
  }

  // getAllMealId(dietId: string): Observable<DietBook> {
  //   return this.getDietBookById(dietId).pipe(
  //     map((dietbook: DietBook) => {
  //       if (dietbook.meal && dietbook.meal.length > 0) {
  //         // Mapping meal Ids to meals array
  //         dietbook.meal = dietbook.meal.map((mealId) => ({ id: mealId }));
  //       }

  //       return dietbook;
  //     })
  //   );
  // }
}

// addDietBook(formValue: {
//   id: string;
//   title: string;
//   pathology: string;
//   sexe: string;
//   nbStage: number;
//   nbWeekPerStage: number;
//   description: string;
//   meal?: [string];
// }): Observable<DietBook> {
//   return this.getAllDietBooks().pipe(
//     map((dietBooks) => [...dietBooks].sort((a, b) => a.id - b.id)),
//     map((sortedDietBooks) => sortedDietBooks[sortedDietBooks.length - 1]),
//     map((previousDietBooks) => ({
//       ...formValue,
//       id: +previousDietBooks.id + 1,
//     })),
//     switchMap((newDietBook) =>
//       this.http.post<DietBook>(
//         "http://localhost:5400/api/dietbooks/add_diet_book",
//         newDietBook
//       )
//     )
//   );
// }
// }
