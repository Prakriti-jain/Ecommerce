import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PageHeader } from "../../shared/page-header/page-header";
import { NgFor} from '@angular/common';
import { Cart } from '../../services/cart';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Order } from '../../services/order';

@Component({
  selector: 'app-payment',
  imports: [PageHeader, NgFor, FormsModule],
  templateUrl: './payment.html',
  styleUrl: './payment.css',
})
export class Payment implements OnInit {
  cartItems:any[]=[];
  totalAmount:number=0;
  method:string="UPI";

  userId:any;

  constructor(
    private cartService: Cart,
    private auth:AuthService,
    private router:Router, 
    private orderService : Order, 
    private cd : ChangeDetectorRef
  ){}
  
  ngOnInit(): void {
    this.userId = this.auth.getUser()?.id;
    this.cartService.getCartItems(this.userId).subscribe(res=>{
      this.cartItems = res.cartItems;
      this.cartItems.forEach(i=>{
        this.totalAmount += i.product.price * i.quantity;
      })
      this.cd.detectChanges();
    });
  }

  payNow() {

    this.orderService.placeOrder(this.userId).subscribe({
      next:(res) => {
        alert("Order placed successfully!");
        this.router.navigate(['./order-success']);
      },
      error: (err) => {
        alert(err.error.message || "Order failed");
      }
    });
  }
}
