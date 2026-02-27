import { Component, OnInit } from '@angular/core';
import { PageHeader } from "../../shared/page-header/page-header";
import { NgFor, NgIf} from '@angular/common';
import { Cart } from '../../services/cart';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Order } from '../../services/order';
import { Observable, Subject, catchError, map, switchMap, tap, of, EMPTY} from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-payment',
  imports: [PageHeader, NgFor, NgIf, FormsModule, AsyncPipe],
  templateUrl: './payment.html',
  styleUrl: './payment.css',
})
export class Payment implements OnInit {
  // cartItems:any[]=[];
  // totalAmount:number=0;
  cartItems$! : Observable<any[]>;
  totalAmount$! : Observable<number>;

  private payTrigger$ = new Subject<void>();
  payment$! : Observable<any>;

  method:string="UPI";
  userId:any;

  constructor(
    private cartService: Cart,
    private auth:AuthService,
    private router:Router, 
    private orderService : Order, 
  ){}
  
  ngOnInit(): void {
    this.userId = this.auth.getUser()?.id;
    // this.cartService.getCartItems(this.userId).subscribe(res=>{
    //   this.cartItems = res.cartItems;
    //   this.cartItems.forEach(i=>{
    //     this.totalAmount += i.product.price * i.quantity;
    //   })
    //   this.cd.detectChanges();
    // });

    this.cartItems$ = this.cartService.getCartItems(this.userId).pipe(
      map(res => res.cartItems)
    );

    this.totalAmount$ = this.cartItems$.pipe(map(items => items.reduce((total, item) => total + item.product.price * item.quantity, 0)));

    this.payment$ = this.payTrigger$.pipe(
      switchMap(() => this.orderService.placeOrder(this.userId)),
      tap(() => {
        alert("Order placed successfully!");
        this.cartService.triggerRefresh();
        this.router.navigate(['./order-success']);
      }),

      catchError((err) => {
        alert(err.error.message || err.error || "Order failed");
        return EMPTY;
      })

    )
  }

  // payNow() {

  //   this.orderService.placeOrder(this.userId).subscribe({
  //     next:(res) => {
  //       alert("Order placed successfully!");
  //       this.router.navigate(['./order-success']);
  //     },
  //     error: (err) => {
  //       alert(err.error.message || "Order failed");
  //     }
  //   });
  // }

  payNow() {
    this.payTrigger$.next();
  }
}
