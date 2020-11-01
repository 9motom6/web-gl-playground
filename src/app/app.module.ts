import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";

import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {WebGl2FundsModule} from "./web-gl2-funds/web-gl2-funds.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatIconModule} from "@angular/material/icon";
import {MatSliderModule} from "@angular/material/slider";

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        WebGl2FundsModule,
        BrowserAnimationsModule,
        MatExpansionModule,
        MatIconModule,
        MatSliderModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
