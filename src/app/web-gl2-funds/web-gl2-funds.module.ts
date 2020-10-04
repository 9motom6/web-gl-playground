import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelloWorldComponent } from './first/hello-world.component';



@NgModule({
  declarations: [HelloWorldComponent],
  exports: [
    HelloWorldComponent
  ],
  imports: [
    CommonModule
  ]
})
export class WebGl2FundsModule { }
