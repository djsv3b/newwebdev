import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },  // Home page protected
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },  // Login handled by AuthGuard
  { path: 'sign-up', component: SignUpComponent, canActivate: [AuthGuard] }  // Sign-up also handled
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
