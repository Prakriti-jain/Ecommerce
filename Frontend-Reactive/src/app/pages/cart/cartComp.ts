import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Cart } from '../../services/cart';
import { NgFor, NgIf} from '@angular/common';
import { AuthService } from '../../services/auth';
import { Order } from '../../services/order';
import { Router } from '@angular/router';
import { PageHeader } from "../../shared/page-header/page-header";
import { Observable, Subject, map, merge, shareReplay, startWith, switchMap} from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [NgFor, NgIf, PageHeader, AsyncPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class CartComponent implements OnInit {
  // cartItems:any[] = [];
  loggedUser:any;
  userId:any ; 

  //action triggers - that is jab bhi button click ho tab api call ho and ui update
  private increaseQty$ = new Subject<any>();
  private decreaseQty$ = new Subject<any>();
  private removeItem$ = new Subject<any>();

  cartItems$!: Observable<any[]>;
  totalAmount$! : Observable<number>;

  constructor(private router :Router, private authService: AuthService, private cartService:Cart, private orderService : Order){}

  // button click -> event -> API call -> cart data -> UI update
  // ngOnInit me humne define kiya hai ki jab bhi increaseQty$, decreaseQty$, removeItem$ emit karein, tab switchMap se API call ho.
  // and jo bahar functions hain wo click par call hoke .next() se signal emit karte hain.
  ngOnInit(){
    this.loggedUser = this.authService.getUser();
    if(!this.loggedUser){
      alert("Please login first");
      return;
    }
    
    this.userId = this.loggedUser.id;

    // this.loadCart();

    const increase$ = this.increaseQty$.pipe(
      switchMap(item => this.cartService.updateQuantity(item.id, item.quantity + 1))
    )

    const decrease$ = this.decreaseQty$.pipe(
      switchMap(item => this.cartService.updateQuantity(item.id, item.quantity - 1))
    )

    const remove$ = this.removeItem$.pipe(
      switchMap(id => this.cartService.removeItem(id))
    )

    //this is for reloading cart whenevr any action happens
    this.cartItems$ = merge(this.cartService.getRefreshTrigger(), increase$, decrease$, remove$).
      pipe(startWith(null), switchMap(() => this.cartService.getCartItems(this.userId)), map(res => res.cartItems), shareReplay(1)
  )

    this.totalAmount$ = this.cartItems$.pipe(
      map(items => items.reduce((total, item) => total + item.product.price * item.quantity, 0))
    )
  }

  increaseQty(item : any) {
    if(item.quantity+1 > item.product.stock) {
      alert('Not enough stock!')
    } else {
      this.increaseQty$.next(item);
    }
    
  }

  decreaseQty(item : any) {
    this.decreaseQty$.next(item);
  }

  remove(itemId : number) {
    this.removeItem$.next(itemId);
  }

  
  
// totalAmount:number = 0;

// loadCart() {
//   this.cartService.getCartItems(this.userId).subscribe({
//     next:(res)=>{
//       this.cartItems = res.cartItems;
//       this.calculateTotal();
//       this.cd.detectChanges();
//     }
//   })
// }


// loadCart() {
//   this.cartItems$ = this.cartService.getCartItems(this.userId).pipe(
//     map(res => res.cartItems)
//   );

//   this.totalAmount$ = this.cartItems$.pipe(
//     map(items => items.reduce((total, item) => total + item.product.price * item.quantity, 0))
//   );
// }

// increaseQty(item:any){
//   item.quantity++;

//   this.cartService.updateQuantity(item.id,item.quantity).subscribe(()=>{
//     this.calculateTotal();
//   });
// }

// decreaseQty(item:any){
//   if(item.quantity > 1){
//     item.quantity--;

//     this.cartService.updateQuantity(item.id,item.quantity).subscribe(()=>{
//       this.calculateTotal();
//     });
//   }
// }

// calculateTotal(){
//   this.totalAmount = 0;

//   this.cartItems.forEach(item=>{
//     this.totalAmount += item.product.price * item.quantity;
//   });
// }



  // remove(itemId:number){
  //   this.cartService.removeItem(itemId).subscribe(()=>{
  //     this.loadCart();
  //   })
  // }

  placeOrder() {
    const user = this.authService.getUser();
    if(!user) {
      alert('Login First!');
      return;
    }

    this.router.navigate(['./payment']);
    // this.loadCart(); //cart empty
  }

  
}
