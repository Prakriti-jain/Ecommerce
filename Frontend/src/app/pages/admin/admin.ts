import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth';
import { Router , RouterLink} from '@angular/router';

@Component({
  selector: 'app-admin',
  imports: [NgIf, RouterLink],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})

export class Admin implements OnInit {
  loggedUser : any;
  showProfileMenu : boolean = false;

  constructor(private authService : AuthService, private router : Router) {}

  ngOnInit() {
    this.loggedUser = this.authService.getUser();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['./login']);
  }

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }
}
