import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import * as moment from 'moment';

@Directive({
  selector: '[appFormatDate]'
})
export class FormatDateDirective implements OnInit {
  @Input('appFormatDate') date!: string;
  @Input() format: string = 'YYYY-MM-DD HH:mm:ss';
  @Input() timezone: string = 'America/Lima';

  constructor(private el: ElementRef) { }

  ngOnInit() {
    const formattedDate = moment.tz(this.date, this.timezone).format(this.format);
    this.el.nativeElement.innerText = formattedDate;
  }
}
