import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {WebGl2FundsModule} from './web-gl2-funds/web-gl2-funds.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    WebGl2FundsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
