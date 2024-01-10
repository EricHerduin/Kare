// autofocus.directive.ts

import { Directive, ElementRef, AfterViewInit, Renderer2 } from "@angular/core";

@Directive({
  selector: "[appAutofocus]",
})
export class AutofocusDirective implements AfterViewInit {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit() {
    const collationListControls =
      this.el.nativeElement.parentElement.parentElement.querySelectorAll(
        ".form-group input"
      );

    if (collationListControls.length > 0) {
      const lastInput = collationListControls[collationListControls.length - 1];
      this.renderer.selectRootElement(lastInput).focus();
    }
  }
}
