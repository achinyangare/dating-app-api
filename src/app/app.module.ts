import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {ValueComponent} from './value/value.component';
import {HttpClientModule} from '@angular/common/http';
import {NavComponent} from './nav/nav.component';
import {FormsModule} from '@angular/forms';
import {AuthenticationService} from './_services/authentication.service';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
    declarations: [
        AppComponent,
        ValueComponent,
        NavComponent,
        HomeComponent,
        RegisterComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule
    ],
    providers: [
        AuthenticationService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
