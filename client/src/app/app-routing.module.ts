import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { SigninComponent } from './signin/signin.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    // entry page
    path: 'home', 
    title: 'Quotes Against Humanity',
    component: HomeComponent,
  }, 
  {
    path: 'signup', 
    title: 'Sign Up',
    component: SignupComponent
  },
  {
    path: 'signin', 
    title: 'Sign In',
    component: SigninComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
