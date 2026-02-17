import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { Home } from './pages/home/home';
import { SignupComponent } from './pages/signup/signup';
import { CartComponent } from './pages/cart/cartComp';
import { OrderSuccess } from './pages/order-success/order-success';
import { Orders } from './pages/orders/orders';
import { OrderDetail } from './pages/order-detail/order-detail';
import { ProductDetail } from './pages/product-detail/product-detail';
import { Profile } from './pages/profile/profile';
import { ProfileUpdate } from './pages/profile-update/profile-update';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'home', component: Home},
    {path: 'signup', component: SignupComponent},
    {path: 'cart', component: CartComponent}, 
    {path: 'order-success', component: OrderSuccess}, 
    {path: 'orders', component: Orders},
    {path: 'order/:id', component: OrderDetail},
    {path: 'products/:id', component: ProductDetail},
    {path: 'profile', component: Profile},
    {path: 'profile/update', component: ProfileUpdate}
];
