import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelloWorldComponent } from './hello-world/hello-world.component';
import { ImageComponent } from './image/image.component';



@NgModule({
  declarations: [HelloWorldComponent, ImageComponent],
    exports: [
        HelloWorldComponent,
        ImageComponent
    ],
  imports: [
    CommonModule
  ]
})
export class WebGl2FundsModule { }
