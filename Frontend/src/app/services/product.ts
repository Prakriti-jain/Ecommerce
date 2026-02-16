import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = "http://localhost:8080/products";

  constructor(private http : HttpClient) {}
  
  getAllProducts() : Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }
}
