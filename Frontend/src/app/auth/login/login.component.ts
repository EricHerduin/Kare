import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";
import { Router } from "@angular/router";
import { catchError, EMPTY, Observable, tap, shareReplay } from "rxjs";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading!: boolean;
  errorMsg!: string;
  isAuth$!: Observable<boolean>;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isAuth$ = this.auth.isAuth$.pipe(shareReplay(1));
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
    });
  }

  onLogin() {
    this.loading = true;
    const email = this.loginForm.get("email")!.value;
    const password = this.loginForm.get("password")!.value;
    this.auth
      .loginUser(email, password)
      .pipe(
        tap((response) => {
          this.loading = false;
          const userRole = response.role;

          if (userRole === 2) {
            this.router.navigate(["/home"]);
          } else if (userRole === 0 || userRole === 1) {
            this.router.navigate(["/homepage"]);
          }
        }),
        catchError((error) => {
          this.loading = false;
          if (error.message && error.error.passwordExpired) {
            this.errorMsg =
              "Mot de passe expiré. veuillez réinitialiser votre mot de passe";
          } else {
            this.errorMsg = error.message;
          }
          return EMPTY;
        })
      )
      .subscribe();
  }
}

// import { Component, OnInit } from "@angular/core";
// import { FormBuilder, FormGroup, Validators } from "@angular/forms";
// import { AuthService } from "src/app/services/auth.service";
// import { Router } from "@angular/router";
// import { catchError, EMPTY, Observable, tap, shareReplay } from "rxjs";

// @Component({
//   selector: "app-login",
//   templateUrl: "./login.component.html",
//   styleUrls: ["./login.component.scss"],
// })
// export class LoginComponent implements OnInit {
//   loginForm!: FormGroup;
//   loading!: boolean;
//   errorMsg!: string;
//   isAuth$!: Observable<boolean>;

//   constructor(
//     private formBuilder: FormBuilder,
//     private auth: AuthService,
//     private router: Router
//   ) {}

//   ngOnInit() {
//     // Vérifie s'il y a un token dans le local storage
//     const token = localStorage.getItem("token");
//     if (token) {
//       // Redirige l'utilisateur vers la page souhaitée (par exemple, "/dietbooks")
//       this.router.navigate(["/dietbooks"]);
//       return;
//     }

//     // S'il n'y a pas de token, initialise le formulaire de connexion
//     this.isAuth$ = this.auth.isAuth$.pipe(shareReplay(1));
//     this.loginForm = this.formBuilder.group({
//       email: [null, [Validators.required, Validators.email]],
//       password: [null, Validators.required],
//     });
//   }

//   onLogin() {
//     this.loading = true;
//     const email = this.loginForm.get("email")!.value;
//     const password = this.loginForm.get("password")!.value;
//     this.auth
//       .loginUser(email, password)
//       .pipe(
//         tap((response) => {
//           const token = response.token; // Extrait le token de la réponse
//           this.loading = false;
//           // Enregistre le token dans le local storage
//           localStorage.setItem('token', token);
//           this.router.navigate(["/dietbooks"]);
//         }),
//         catchError((error) => {
//           this.loading = false;
//           this.errorMsg = error.message;
//           return EMPTY;
//         })
//       )
//       .subscribe();
//   }
// }
