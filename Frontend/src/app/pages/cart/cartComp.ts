import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Cart } from '../../services/cart';
import { NgFor, NgIf} from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-cart',
  imports: [NgFor, NgIf],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class CartComponent implements OnInit {
  cartItems:any[] = [];
  loggedUser:any;
  userId:any ; 

  constructor(private authService: AuthService, private cartService:Cart, private cd : ChangeDetectorRef){}

  ngOnInit(){
    this.loggedUser = this.authService.getUser();
    if(!this.loggedUser){
      alert("Please login first");
      return;
    }
    
    this.userId = this.loggedUser.id;

    this.loadCart();
  }

totalAmount:number = 0;

loadCart() {
  this.cartService.getCartItems(this.userId).subscribe({
    next:(res)=>{
      this.cartItems = res.cartItems;
      this.calculateTotal();
      this.cd.detectChanges();
    }
  })
}

increaseQty(item:any){
  item.quantity++;

  this.cartService.updateQuantity(item.id,item.quantity).subscribe(()=>{
    this.calculateTotal();
  });
}

decreaseQty(item:any){
  if(item.quantity > 1){
    item.quantity--;

    this.cartService.updateQuantity(item.id,item.quantity).subscribe(()=>{
      this.calculateTotal();
    });
  }
}

calculateTotal(){
  this.totalAmount = 0;

  this.cartItems.forEach(item=>{
    this.totalAmount += item.product.price * item.quantity;
  });
}



  remove(itemId:number){
    this.cartService.removeItem(itemId).subscribe(()=>{
      this.loadCart();
    })
  }
}
