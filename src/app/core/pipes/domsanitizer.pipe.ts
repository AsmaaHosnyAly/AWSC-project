import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'domsanitizer'
})
export class DomsanitizerPipe implements PipeTransform {
constructor(private domsanitizer:DomSanitizer){}
  // transform(URL:string): unknown {
  //   const domurl=`icon:url('${URL}')`;
  //   return this.domsanitizer.bypassSecurityTrustUrl(domurl);
  // }
  transform(value: any, args?: any): any {
    return this.domsanitizer.bypassSecurityTrustHtml(value);
  }
}
