import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './guards/auth.guard';
import { EditProfileComponent } from './components/user-profile/edit-profile/edit-profile.component';
import { RestaurantDetailComponent } from './components/restaurant/restaurant-detail/restaurant-detail.component';
import { OwnerCreateRestaurantComponent } from './components/owner/owner-create-restaurant/owner-create-restaurant.component';
import { OwnerRestaurantsComponent } from './components/owner/owner-restaurants/owner-restaurants.component';
import { ProfileComponent } from './components/user-profile/profile/profile.component';
import { ChangePasswordComponent } from './components/user-profile/change-password/change-password.component';
import { RestaurantsComponent } from './components/restaurant/restaurants/restaurants.component';
import { OwnerEditRestaurantComponent } from './components/owner/owner-edit-restaurant/owner-edit-restaurant.component';
import { OwnerMenusComponent } from './components/owner/owner-menus/owner-menus.component';
import { OwnerCreateMenuComponent } from './components/owner/owner-create-menu/owner-create-menu.component';
import { OwnerEditMenuComponent } from './components/owner/owner-edit-menu/owner-edit-menu.component';
import { OwnerMenuItemsComponent } from './components/owner/owner-menu-items/owner-menu-items.component';
import { OwnerCreateMenuItemsComponent } from './components/owner/owner-create-menu-items/owner-create-menu-items.component';
import { OwnerEditMenuItemsComponent } from './components/owner/owner-edit-menu-items/owner-edit-menu-items.component';
import { CartComponent } from './components/cart/cart.component';


export const routes: Routes = [
    {path: '', component: HomeComponent},
    //Auth
    {path: 'auth/login', component: LoginComponent},
    {path: 'auth/signup', component: SignupComponent},
    //Cliente
    {path: 'restaurants', component: RestaurantsComponent},
    {path: 'restaurants/:id', component: RestaurantDetailComponent},
    //Perfil de Utilizador
    {
      path: 'profile',
      canActivate: [authGuard],
      children: [
        { path: '', component: ProfileComponent },
        { path: 'edit', component: EditProfileComponent },
        { path: 'change-password', component: ChangePasswordComponent },
      ]
    },
    //Dono do restaurante
    {
      path: 'owner',
      canActivate: [authGuard],
      children: [
        { path: 'restaurants', component: OwnerRestaurantsComponent },
        { path: 'restaurants/create', component: OwnerCreateRestaurantComponent },
        { path: 'restaurants/:id', component: OwnerEditRestaurantComponent },
        { path: 'restaurants/:id/menus', component: OwnerMenusComponent},
        { path: 'restaurants/:id/menus/create', component: OwnerCreateMenuComponent},
        { path: 'restaurants/:id/menus/:menuId/edit', component: OwnerEditMenuComponent},
        { path: 'restaurants/:id/menus/:menuId/items', component: OwnerMenuItemsComponent},
        { path: 'restaurants/:id/menus/:menuId/items/create', component: OwnerCreateMenuItemsComponent},
        { path: 'restaurants/:id/menus/:menuId/items/:itemId/edit', component: OwnerEditMenuItemsComponent}
      ]
    },
    { path: 'cart', canActivate: [authGuard], component: CartComponent}
];
