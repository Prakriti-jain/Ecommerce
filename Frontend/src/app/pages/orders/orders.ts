import { Component } from '@angular/core';
import { Order } from '../../services/order';
import { AuthService } from '../../services/auth';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { PageHeader } from "../../shared/page-header/page-header";

@Component({
  selector: 'app-orders',
  imports: [RouterLink, NgFor, NgIf, PageHeader],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders {
  orders : any[] = [];
  user : any;

  constructor(private orderService: Order, private authService : AuthService, private cd : ChangeDetectorRef) {}

  ngOnInit() {
    this.user = this.authService.getUser();

    if(!this.user){
      alert("Login first");
      return;
    }

    this.orderService.getOrdersByUser(this.user.id).subscribe({
      next:(res:any) => {
        this.orders = res;
        this.cd.detectChanges();
      }
    });
  }

}
