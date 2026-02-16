import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Cart {

  private baseUrl = 'http://localhost:8080/cart';

  constructor(private http: HttpClient) {}
  
    addToCart(userId:number, productId:number, quantity:number):Observable<any>{
    return this.http.post(`${this.baseUrl}/add`,{
      userId,
      productId,
      quantity
    });
  }

    getCartItems(userId:number):Observable<any>{
    return this.http.get(`${this.baseUrl}/${userId}`);
  }

  removeItem(itemId:number):Observable<any>{
    return this.http.delete(`${this.baseUrl}/item/${itemId}`);
  }

  updateQuantity(itemId:number, quantity:number){
    return this.http.put(`${this.baseUrl}/item/${itemId}`,{
      quantity
    });
  }

}
