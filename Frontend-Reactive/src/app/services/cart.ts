import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap, switchMap, map, startWith } from 'rxjs';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root',
})
export class Cart {

  private baseUrl = 'http://localhost:8080/cart';
  private cartRefresh$ = new Subject<void>();
  cartCount$! : Observable<number>;

  constructor(private http: HttpClient, private auth : AuthService) {
    
  }

  ngOnInit() {
    this.cartCount$ = this.auth.user$.pipe(
        switchMap(user => {
          if(!user) return [0];
          return this.cartRefresh$.pipe(
                  startWith(null),
                  switchMap(() => this.getCartCount(user.id)),
                  map(res => res.cartItems.length)
                  );
        })
      )
  }

  getRefreshTrigger() : Observable<void>{
    return this.cartRefresh$.asObservable();
  }

  triggerRefresh() {
    this.cartRefresh$.next();
    
  }
  
  addToCart(userId:number, productId:number, quantity:number):Observable<any>{
    return this.http.post(`${this.baseUrl}/add`,{
      userId,
      productId,
      quantity
    }).pipe(
      tap(() => this.triggerRefresh())
    );
  }

  getCartItems(userId:number):Observable<any>{
    return this.http.get(`${this.baseUrl}/${userId}`);
  }

  removeItem(itemId:number):Observable<any>{
    return this.http.delete(`${this.baseUrl}/item/${itemId}`).pipe(
      tap(() => this.triggerRefresh())
    );
  }

  updateQuantity(itemId:number, quantity:number){
    return this.http.put(`${this.baseUrl}/item/${itemId}`,{
      quantity
    }).pipe(
      tap(() => this.triggerRefresh())
    );
  }

  getCartCount(userId : number) {
    return this.getCartItems(userId)
  }
}
