import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomsanitizerPipe } from './domsanitizer.pipe';



@NgModule({
  declarations: [
    DomsanitizerPipe
  ],
  imports: [
    CommonModule
  ]
})
export class PipesModule { }
