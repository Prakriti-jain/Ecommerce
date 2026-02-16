import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { Home } from './pages/home/home';
import { SignupComponent } from './pages/signup/signup';
import { CartComponent } from './pages/cart/cartComp';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'home', component: Home},
    {path: 'signup', component: SignupComponent},
    {path: 'cart', component: CartComponent}
];
