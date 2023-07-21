import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';

// communication with the server
import { HttpClientModule } from '@angular/common/http';
import { UserService } from './user.service';

// front end stuff
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ApiService } from './api.service';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    ApiService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
