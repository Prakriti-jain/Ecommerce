import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Order {
  private baseUrl = 'http://localhost:8080/orders';

  constructor(private http : HttpClient) {}

  placeOrder(userId:number) : Observable<any> {
    return this.http.post(`${this.baseUrl}/place/${userId}`, {});
  }

  //get order list of the user
  getOrdersByUser(userId:number) {
    return this.http.get(`${this.baseUrl}/user/${userId}`);
  }

  getOrderDetail(orderId : number) {
    return this.http.get(`${this.baseUrl}/${orderId}`);
  }
}
