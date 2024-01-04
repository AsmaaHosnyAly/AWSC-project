import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';


@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {

  transform(value: string, format: string): string {
    const datePipe = new DatePipe('en-US');
    const formattedDate:any = datePipe.transform(value, format);
    return formattedDate;
  }

}
