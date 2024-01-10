import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root",
})
export class MessageService {
  constructor(private snackBar: MatSnackBar) {}

  showMessage(message: string): void {
    this.snackBar.open(message, "Fermer", {
      duration: 4000, // Durée du message en millisecondes
    });
  }
  showErrorMessage(message: string): void {
    this.snackBar.open(message, "Erreur", {
      duration: 4000, // durée en millisecondes pour laquelle le message sera affiché
      panelClass: ["error-snackbar"], // classe CSS pour personnaliser le style du message
    });
  }
}
