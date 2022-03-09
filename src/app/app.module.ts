import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { FormQuestionComponent } from './dynamic-form/form-question.component';
import { MenuComponent } from './menu/menu.component';
import { OKTA_PROVIDER } from './okta-config';

@NgModule({
  declarations: [
    AppComponent,
    DynamicFormComponent,
    FormQuestionComponent,
    MenuComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [
    OKTA_PROVIDER
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
