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
import { Payment } from './pages/payment/payment';
import { authGuard } from './guards/auth-guard';
import { Admin } from './pages/admin/admin';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: '', component: Home},
    {path: 'signup', component: SignupComponent},
    {path: 'cart', component: CartComponent}, 

    //Auth guard on pages
    {path: 'order-success', component: OrderSuccess, canActivate:[authGuard]}, 
    {path: 'orders', component: Orders, canActivate:[authGuard]},
    {path: 'order/:id', component: OrderDetail, canActivate:[authGuard]},
    {path: 'products/:id', component: ProductDetail, canActivate:[authGuard]},
    {path: 'profile', component: Profile, canActivate:[authGuard]},
    {path: 'profile/update', component: ProfileUpdate, canActivate:[authGuard]},
    {path: 'payment', component: Payment, canActivate:[authGuard]},
    
    //later admin guard on admin dashboard
    {path: 'admin', component: Admin, canActivate:[adminGuard]}
];
