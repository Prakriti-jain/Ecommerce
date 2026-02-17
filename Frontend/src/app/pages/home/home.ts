import { Component, HostListener } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { ProductService } from '../../services/product';
import { Product } from '../../models/product.model';
import { OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router, RouterLink } from "@angular/router";
import { Cart } from '../../services/cart';

@Component({
  selector: 'app-home',
  imports: [NgFor, RouterLink, NgIf],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  products : Product[] = [];

  // Applying pagination
  pagedProducts:any[] = [];
  currentPage:number = 1;
  itemsPerPage:number = 10;
  totalPages:number = 0;

  loggedUser:any;

  constructor(private cartService:Cart, private authService : AuthService , private productService : ProductService, private cd : ChangeDetectorRef, private router : Router) {}

  ngOnInit() {
    this.loggedUser = this.authService.getUser();

    this.productService.getAllProducts().subscribe( res => {
      console.log('Products: ', res);
      this.products = res;
      this.totalPages = Math.ceil(this.products.length / this.itemsPerPage);
      this.updatePageProducts();
      this.cd.detectChanges();
    });

    this.loadCartCount();
  }

  updatePageProducts() {
    const startInd = (this.currentPage-1) * this.itemsPerPage;
    const endInd = startInd + this.itemsPerPage;

    this.pagedProducts = this.products.slice(startInd, endInd);
  }

  nextPage(){
  if(this.currentPage < this.totalPages){
    this.currentPage++;
    this.updatePageProducts();
  }
}

prevPage(){
  if(this.currentPage > 1){
    this.currentPage--;
    this.updatePageProducts();
  }
}


  logout() {
    this.authService.logout();
    this.router.navigate(['./login']);
  }

  addToCart(productId : number) {
    const userId = this.loggedUser.id;
    this.cartService.addToCart(userId, productId,1).subscribe({
      next:(res) => {
        alert("Product added to cart");
        this.loadCartCount();
      },
      error:(err) => {
        alert("Error adding to cart");
      }
    });
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  showProfileMenu : boolean = false

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  cartCount:number = 0;

  loadCartCount(){

    const user = this.authService.getUser();
    if(!user) return;

    this.cartService.getCartCount(user.id).subscribe((res:any)=>{
      this.cartCount = res.cartItems.length;
      this.cd.detectChanges();
    });
  }

  goToProduct(id : number) {
    this.router.navigate(['/products', id])
  }
}
