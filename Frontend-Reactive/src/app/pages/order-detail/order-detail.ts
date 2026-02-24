import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Order } from '../../services/order';
import { NgIf, NgFor } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { PageHeader } from "../../shared/page-header/page-header";
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';


@Component({
  selector: 'app-order-detail',
  imports: [NgIf, NgFor, PageHeader, AsyncPipe],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.css',
})
export class OrderDetail {
  // order : any;
  order$! : Observable<any>;

  constructor(private route : ActivatedRoute, private orderService : Order, private cd : ChangeDetectorRef) {
  }

  ngOnInit() {
    const orderId = this.route.snapshot.params['id'];
    // this.orderService.getOrderDetail(orderId).subscribe({
    //   next : (res:any) => {
    //     this.order = res;
    //     console.log(res);
    //     this.cd.detectChanges();
    //   }
    // });

    this.order$ = this.orderService.getOrderDetail(orderId);

  }
}
