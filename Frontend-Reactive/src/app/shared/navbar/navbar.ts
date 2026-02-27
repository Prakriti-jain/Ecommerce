import { Component, EventEmitter, Output } from '@angular/core';
import { UiState } from '../../services/ui-state';
import { AuthService } from '../../services/auth';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { AsyncPipe } from '@angular/common';
import { Observable, startWith, switchMap, map } from 'rxjs';
import { Cart } from '../../services/cart';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-navbar',
  imports: [NgIf, AsyncPipe, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  loggedUser$! : Observable<User | null>;
  showProfileMenu : boolean = false;
  cartCount$! : Observable<number>;
  showNavbar$! : Observable<boolean>;


  constructor(
    private auth : AuthService, 
    private ui : UiState, 
    private router : Router,
    private cartService : Cart,
  ) {

    this.showNavbar$ = this.router.events.pipe(
      startWith(null),
      map(() => {
        const url = this.router.url;
        return !(url.includes('login') || url.includes('signup') || url.includes('admin'));
      })
    );
  }

  ngOnInit() {
    this.loggedUser$ = this.auth.user$;
    this.cartCount$ = this.auth.user$.pipe(
      switchMap(user => {
        if(!user) return [0];
        return this.cartService.getRefreshTrigger().pipe(
                startWith(null),
                switchMap(() => this.cartService.getCartCount(user.id)),
                map(res => res.cartItems.length)
                );
      })
    )
  }


  onSearch(event : any) {
    this.ui.setSearch(event.target.value);
  }

  sortProducts(event : any) {
    this.ui.setSort(event.target.value);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['./login']);
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }
}
