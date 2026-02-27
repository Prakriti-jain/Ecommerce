import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product';
import { Cart } from '../../services/cart';
import { AuthService } from '../../services/auth';
import { NgIf } from '@angular/common';
import { PageHeader } from '../../shared/page-header/page-header';
import { Observable} from 'rxjs';
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
  quantity : number = 1;

  constructor(
    private route:ActivatedRoute,
    private productService:ProductService,
  ){}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.product$ = this.productService.getProductById(id);

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
}

