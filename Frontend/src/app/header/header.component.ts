import { Component } from "@angular/core";

import { AuthService } from "../services/auth.service";
import { Observable, shareReplay } from "rxjs";
import { SharedService } from "../services/shared.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent {
  textHeader!: string;
  isAuth$!: Observable<boolean>;
  userRole$!: Observable<number | null>;
  userName$!: Observable<string | null>;

  constructor(private auth: AuthService, private shareService: SharedService) {}

  ngOnInit() {
    this.isAuth$ = this.auth.isAuth$.pipe(shareReplay(1));
    this.userRole$ = this.auth.userRole$;
    this.userName$ = this.auth.userName$;

    this.shareService.getTextHeader().subscribe((text) => {
      this.textHeader = text;
    });
  }

  onLogout() {
    this.auth.logout();
  }
}
