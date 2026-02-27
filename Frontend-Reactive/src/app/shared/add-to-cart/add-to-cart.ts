import { Component, Input } from '@angular/core';
import { Product } from '../../models/product.model';
import { combineLatest, Observable, Subject, switchMap, of, tap } from 'rxjs';
import { Cart } from '../../services/cart';
import { AuthService } from '../../services/auth';
import { NgIf } from '@angular/common';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-add-to-cart',
  imports: [NgIf, AsyncPipe],
  templateUrl: './add-to-cart.html',
  styleUrl: './add-to-cart.css',
})
export class AddToCart {
  @Input() product!: Product;
  private click$ = new Subject<void>();
  addResults$ !: Observable<any>;

  constructor(private cart : Cart, private auth : AuthService) {}

  ngOnInit() {
    this.addResults$ = combineLatest([
      this.click$, this.auth.user$
    ]).pipe(
      switchMap(([_, user]) => {
        if(!user) return of(null);
        return this.cart.addToCart(user.id, this.product.id, 1);
      }),
      tap(() => alert("Product added to cart"))
    )
  }

  add() {
    this.click$.next();
  }


}
