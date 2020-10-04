import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirstComponent } from './first/first.component';



@NgModule({
  declarations: [FirstComponent],
  exports: [
    FirstComponent
  ],
  imports: [
    CommonModule
  ]
})
export class WebGl2FundsModule { }
