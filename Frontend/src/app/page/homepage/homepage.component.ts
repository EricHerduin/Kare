import { Component, OnInit } from "@angular/core";
import { SharedService } from "src/app/services/shared.service";

@Component({
  selector: "app-homepage",
  templateUrl: "./homepage.component.html",
  styleUrls: ["./homepage.component.scss"],
})
export class HomepageComponent implements OnInit {
  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    this.sharedService.setTextHeader("Bonjour et Bienvenue");
  }
}
