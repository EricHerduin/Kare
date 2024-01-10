// shared.service.ts

import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SharedService {
  private textHeaderSubject = new BehaviorSubject<string>("");

  setTextHeader(text: string) {
    this.textHeaderSubject.next(text);
  }

  getTextHeader(): Observable<string> {
    return this.textHeaderSubject.asObservable();
  }
}
