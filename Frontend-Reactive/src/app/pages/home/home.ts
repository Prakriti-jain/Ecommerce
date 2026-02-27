import { Component} from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { ProductService } from '../../services/product';
import { Product } from '../../models/product.model';
import { OnInit } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router} from "@angular/router";
import { Cart } from '../../services/cart';
import { BehaviorSubject, combineLatest, Observable , map, Subject} from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Pagination } from '../../shared/pagination/pagination';
import { UiState } from '../../services/ui-state';
import { AddToCart } from "../../shared/add-to-cart/add-to-cart";

@Component({
  selector: 'app-home',
  imports: [NgFor, NgIf, AsyncPipe, Pagination, AddToCart],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  products$! : Observable<Product[]>;
  pagedProducts$! : Observable<Product[]>;
  filteredProducts$! : Observable<Product[]>;
  cartCount$! : Observable<number>;

  itemsPerPage:number = 10;
  totalPages$! : Observable<number>;

  loggedUser:any;

  constructor( 
    private authService : AuthService, 
    private productService : ProductService, 
    private router : Router, 
    public ui : UiState
  ) {}

  ngOnInit() {
    this.loggedUser = this.authService.getUser();
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

    //stream for extracting the products according to the page number
    this.pagedProducts$ = combineLatest([
      this.filteredProducts$,
      this.ui.page$
    ]).pipe(
      map(([products, page]) => {

        const start = (page - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;

        return products.slice(start, end);
      })
    );
  }

  nextPage() {
    this.ui.setPage(this.ui.getCurrentPage() +1)
  }

  prevPage() {
    if(this.ui.getCurrentPage() > 1) {
      this.ui.setPage(this.ui.getCurrentPage() - 1);
    }
  }

  goToProduct(id : number) {
    this.router.navigate(['/products', id])
  }

}
