import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appHandleError]'
})
export class HandleErrorDirective {
  @Input() defaultImage!: string;

  constructor(private el: ElementRef) { }

  @HostListener('error') onError() {
    const element: HTMLImageElement = this.el.nativeElement;
    element.src = this.defaultImage || 'assets/default-image.png';
  }
}
