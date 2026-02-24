import { Component} from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { ProductService } from '../../services/product';
import { Product } from '../../models/product.model';
import { OnInit } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router, RouterLink } from "@angular/router";
import { Cart } from '../../services/cart';
import { BehaviorSubject, combineLatest, Observable , map, Subject, switchMap, startWith, merge, tap} from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Pagination } from '../../shared/pagination/pagination';
import { UiState } from '../../services/ui-state';

@Component({
  selector: 'app-home',
  imports: [NgFor, RouterLink, NgIf, AsyncPipe, Pagination],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  // products : Product[] = [];

  // // Applying pagination
  // pagedProducts:any[] = [];
  // currentPage:number = 1;
  // itemsPerPage:number = 10;
  // totalPages:number = 0;

  // filteredProducts : any[] = [];
  // searchText:string = "";

  products$! : Observable<Product[]>;
  pagedProducts$! : Observable<Product[]>;
  filteredProducts$! : Observable<Product[]>;
  cartCount$! : Observable<number>;

  currentPage$ = new BehaviorSubject<number>(1);

  private addToCartTrigger$ = new Subject<any>();
  addToCartResult$! : Observable<any>;

  itemsPerPage:number = 10;
  totalPages$! :Observable<number>;

  loggedUser:any;

  constructor(private cartService:Cart, private authService : AuthService , private productService : ProductService, private router : Router, private ui : UiState) {}

  ngOnInit() {
    this.loggedUser = this.authService.getUser();

    // this.productService.getAllProducts().subscribe( res => {
    //   // console.log('Products: ', res);
    //   this.products = res;
    //   this.filteredProducts = res;
    //   // console.log('hi' , this.products[0]);
    //   this.totalPages = Math.ceil(this.products.length / this.itemsPerPage);
    //   this.updatePageProducts();
    //   // console.log('Filtered:', this.filteredProducts)
    //   this.cd.detectChanges();
    // });

    // this.loadCartCount();

    this.products$ = this.productService.getAllProducts();

    // merge - event-driven,  combineLatest - state-driven
    this.filteredProducts$ = combineLatest([
      this.products$,
      this.ui.searchText$,
      this.ui.sortType$
    ]).pipe(
      map(([products, search, sort]) => {

        let filtered = products.filter(p =>
          p.name.toLowerCase().includes(search)
        );

        if (sort === 'low') {
          filtered = [...filtered].sort((a, b) => a.price - b.price);
        } else if (sort === 'high') {
          filtered = [...filtered].sort((a, b) => b.price - a.price);
        }

        return filtered;
      })
    );

    //stream for total pages 
    this.totalPages$ = this.filteredProducts$.pipe(
      map(products => Math.ceil(products.length / this.itemsPerPage))
    );

    this.pagedProducts$ = combineLatest([
      this.filteredProducts$,
      this.currentPage$
    ]).pipe(
      map(([products, page]) => {

        const start = (page - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;

        return products.slice(start, end);
      })
    );


    this.addToCartResult$ = this.addToCartTrigger$.pipe(
      switchMap((product) => this.cartService.addToCart(this.loggedUser.id, product.id, 1)),
      tap(() => alert("Product is added to cart "))
    )

    const user = this.authService.getUser();
    if(user) {
      this.cartCount$ = this.addToCartResult$.pipe(
        startWith(null),
        switchMap(() => this.cartService.getCartCount(this.loggedUser.id)),
        map(res => res.cartItems.length)
      );
    }
  }

  nextPage() {
    this.currentPage$.next(this.currentPage$.value +1)
  }

  prevPage() {
    if(this.currentPage$.value > 1) {
      this.currentPage$.next(this.currentPage$.value - 1);
    }
  }

  // updatePageProducts() {
  //   const startInd = (this.currentPage-1) * this.itemsPerPage;
  //   const endInd = startInd + this.itemsPerPage;

  //   this.pagedProducts = this.filteredProducts.slice(startInd, endInd);
  // }

  // nextPage(){
  //   if(this.currentPage < this.totalPages){
  //     this.currentPage++;
  //     this.updatePageProducts();
  //   }
  // }

  // prevPage(){
  //   if(this.currentPage > 1){
  //     this.currentPage--;
  //     this.updatePageProducts();
  //   }
  // }


  logout() {
    this.authService.logout();
    this.router.navigate(['./login']);
  }

  // addToCart(productId : number) {
  //   const userId = this.loggedUser.id;
  //   this.cartService.addToCart(userId, productId,1).subscribe({
  //     next:(res) => {
  //       alert("Product added to cart");
  //       this.loadCartCount();
  //     },
  //     error:(err) => {
  //       alert("Error adding to cart");
  //     }
  //   });
  // }

  //  addToCart(productId : number) {
  //   const userId = this.loggedUser.id;

  //   this.cartService.addToCart(userId, productId,1).subscribe(()=>{
  //     alert("Product added to cart");
  //     this.refreshCart$.next();
  //   });
  // }


  addToCart(product:any) {
    console.log("Home : ", product)
    this.addToCartTrigger$.next(product);
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  showProfileMenu : boolean = false

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  // cartCount:number = 0;

  // loadCartCount(){

  //   const user = this.authService.getUser();
  //   if(!user) return;

  //   this.cartService.getCartCount(user.id).subscribe((res:any)=>{
  //     this.cartCount$ = res.cartItems.length;
  //   });
  // }

  goToProduct(id : number) {
    this.router.navigate(['/products', id])
  }

  // onSearch(event : any) {
  //   this.searchText$.next(event.target.value.toLowerCase());
  //   this.currentPage$.next(1);
  // }

  // sortProducts(event : any) {
  //   this.sortType$.next(event.target.value);
  // }


  // onSearch(event : any) {
  //   this.searchText = event.target.value.toLowerCase();
  //   console.log('search ' , this.searchText);
  //   this.filteredProducts = this.products.filter(p=> {
  //     return p.name.toLowerCase().includes(this.searchText);
  //   });

  //   console.log('Filteredddd :', this.filteredProducts);
  //   this.currentPage = 1; //rest
  //   this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  //   this.updatePageProducts();
  // }

  // sortProducts(event:any) {
  //   const type = event.target.value;
  //   if(type === 'low' ) {
  //     this.filteredProducts.sort((a,b) => a.price - b.price);

  //   } else if (type === 'high') {
  //       this.filteredProducts.sort((a,b) => b.price - a.price);
  //   }

  //   this.updatePageProducts();
  // }
}
