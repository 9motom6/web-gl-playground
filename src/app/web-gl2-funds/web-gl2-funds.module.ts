import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelloWorldComponent } from './hello-world/hello-world.component';
import { ImageComponent } from './image/image.component';
import { TranslationComponent } from './translation/translation.component';
import {MatSliderModule} from "@angular/material/slider";



@NgModule({
  declarations: [HelloWorldComponent, ImageComponent, TranslationComponent],
    exports: [
        HelloWorldComponent,
        ImageComponent,
        TranslationComponent
    ],
    imports: [
        CommonModule,
        MatSliderModule
    ]
})
export class WebGl2FundsModule { }
