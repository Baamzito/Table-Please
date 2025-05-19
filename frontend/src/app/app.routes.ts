import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { RestaurantsComponent } from './components/restaurants/restaurants.component';
import { ProfileComponent } from './components/profile/profile.component';
import { authGuard } from './guards/auth.guard';
import { ChangePasswordComponent } from './components/change-password/change-password.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'auth/login', component: LoginComponent},
    {path: 'auth/signup', component: SignupComponent},
    {path: 'restaurants', component: RestaurantsComponent},
    {path: 'profile', component: ProfileComponent, canActivate: [authGuard]},
    {path: 'profile/change-password', component: ChangePasswordComponent, canActivate: [authGuard]}
];
