import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, tap } from "rxjs";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  isAuth$ = new BehaviorSubject<boolean>(false);
  userRole$ = new BehaviorSubject<number | null>(null);

  userName$ = new BehaviorSubject<string | null>(null);

  private authToken = "";
  private userId = "";

  constructor(private http: HttpClient, private router: Router) {
    // Vérifie si un authToken est déjà présent dans le local storage
    const storedToken = localStorage.getItem("authToken");
    if (storedToken && this.isTokenValid(storedToken)) {
      // Si un authToken valide est présent, met à jour les informations d'authentification
      this.authToken = storedToken;
      this.isAuth$.next(true);
    }
  }

  createUser(email: string, password: string) {
    return this.http.post<{ message: string }>(
      "http://localhost:5400/api/signup",
      { email: email, password: password }
    );
  }

  isTokenValid(token: string): boolean {
    this.authToken = token;
    return token.length > 0;
  }

  getToken() {
    return this.authToken;
  }

  getUserId() {
    return this.userId;
  }

  loginUser(email: string, password: string) {
    return this.http
      .post<any>("http://localhost:5400/api/auth/login", {
        email: email,
        password: password,
      })
      .pipe(
        tap(({ userId, token, role, name }) => {
          this.userId = userId;
          // Vérifie si un authToken est déjà présent et valide
          const storedToken = localStorage.getItem("authToken");
          if (!storedToken || !this.isTokenValid(storedToken)) {
            // Si un authToken n'est pas présent ou n'est pas valide, enregistre le token
            this.authToken = token;
            localStorage.setItem("authToken", this.authToken);
          }
          this.userRole$.next(role);
          this.userName$.next(name);
          console.log(this.userName$, this.userRole$);
          this.isAuth$.next(true);
        })
      );
  }

  logout() {
    this.authToken = "";
    this.userId = "";

    localStorage.removeItem("authToken");
    this.isAuth$.next(false);
    this.router.navigate(["login"]);
  }
}
