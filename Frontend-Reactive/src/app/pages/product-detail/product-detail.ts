import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product';
import { Cart } from '../../services/cart';
import { AuthService } from '../../services/auth';
import { NgIf } from '@angular/common';
import { PageHeader } from '../../shared/page-header/page-header';
import { Observable, of, Subject, switchMap , tap} from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { AddToCart } from "../../shared/add-to-cart/add-to-cart";


@Component({
  selector: 'app-product-detail',
  imports: [NgIf, PageHeader, AsyncPipe, AddToCart],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit{
  product$! : Observable<any>;
  // product : any ;
  quantity : number = 1;
  // added : boolean = false;

  // private addToCartTrigger$ = new Subject<any>();
  // addToCartResult$! : Observable<any>;

  constructor(
    private route:ActivatedRoute,
    private productService:ProductService,
    // private cartService:Cart,
    // private authService:AuthService,
  ){}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];

    // this.productService.getProductById(id).subscribe({
    //   next : (res:any) => {
    //     this.product = res
    //     console.log(res);
    //     this.cd.detectChanges();
    //   }
    // });

    this.product$ = this.productService.getProductById(id);

    // this.addToCartResult$ = this.addToCartTrigger$.pipe(
    //   switchMap((product) => {
    //     const user = this.authService.getUser();
    //     if(!user) return of(null);
    //     return this.cartService.addToCart(user.id, product.id, this.quantity);
    //   }),

    //   tap(() => {
    //     this.added = true;
    //     setTimeout(()=>this.added = false, 1500);
    //   })
    // )
  }

  increase(product: any){
    if(this.quantity < product.stock){
      this.quantity++;
    }
  }

  decrease(){
    if(this.quantity > 1){
      this.quantity--;
    }
  }

  // addToCart(){
  //   const user = this.authService.getUser();
  //   if(!user) return;

  //   this.cartService.addToCart(user.id,this.product.id,this.quantity)
  //     .subscribe(()=>{
  //       this.added = true;
  //       setTimeout(()=> this.added = false,1500);
  //       this.cd.detectChanges();
  //     });
  // }  

  // addToCart(product:any) {
  //   this.addToCartTrigger$.next(product);
  // }
}

