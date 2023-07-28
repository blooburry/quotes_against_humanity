import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { SigninComponent } from './signin/signin.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { inSessionGuard } from 'api/guards';

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
  {
    path: ':user/home', // entry page for users that are signed in
    title: 'Quotes Against Humanity',
    component: DashboardComponent,
    canActivate: [inSessionGuard],
  },
  {
    path: '**',
    title: '404 Not Found',
    component: NotFoundComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
