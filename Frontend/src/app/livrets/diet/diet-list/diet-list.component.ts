import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, catchError, tap, of } from "rxjs";
import { DietBooksService } from "src/app/services/diet-book.service";
import { DietBook } from "src/app/models/diet.model";
import { SharedService } from "src/app/services/shared.service";

@Component({
  selector: "app-diet-list",
  templateUrl: "./diet-list.component.html",
  styleUrls: ["./diet-list.component.scss"],
})
export class DietListComponent implements OnInit {
  dietBooks$!: Observable<DietBook[]>;
  loading!: boolean;
  errorMsg!: string;

  constructor(
    private router: Router,
    private dietBook: DietBooksService,
    private route: ActivatedRoute,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    this.dietBooks$ = this.dietBook.getAllDietBooks();
    this.sharedService.setTextHeader(
      "Liste des Livrets d'équilibrage alimentaire"
    );
  }
  onViewDietBook(_id: string) {
    this.router.navigateByUrl(`dietbook?dietId=${_id}`);
  }

  onNewDietBook() {
    this.router.navigateByUrl("add_diet_book");
  }
}
