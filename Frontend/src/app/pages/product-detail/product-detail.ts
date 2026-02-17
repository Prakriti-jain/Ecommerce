import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product';
import { Cart } from '../../services/cart';
import { AuthService } from '../../services/auth';
import { NgIf } from '@angular/common';
import { PageHeader } from '../../shared/page-header/page-header';


@Component({
  selector: 'app-product-detail',
  imports: [NgIf, PageHeader],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit{
  product : any ;
  quantity : number = 1;
  added : boolean = false;

  constructor(
    private route:ActivatedRoute,
    private productService:ProductService,
    private cartService:Cart,
    private authService:AuthService,
    private cd : ChangeDetectorRef
  ){}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];

    this.productService.getProductById(id).subscribe({
      next : (res:any) => {
        this.product = res
        console.log(res);
        this.cd.detectChanges();
      }
    });
  }

  increase(){
    if(this.quantity < this.product.stock){
      this.quantity++;
    }
  }

  decrease(){
    if(this.quantity > 1){
      this.quantity--;
    }
  }

  addToCart(){
    const user = this.authService.getUser();
    if(!user) return;

    this.cartService.addToCart(user.id,this.product.id,this.quantity)
      .subscribe(()=>{
        this.added = true;
        setTimeout(()=> this.added = false,1500);
        this.cd.detectChanges();
      });
  }  
}
