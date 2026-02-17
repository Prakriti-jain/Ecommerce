import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth';
import { NgIf } from '@angular/common';
import { PageHeader } from '../../shared/page-header/page-header';
import { UpperCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [NgIf, PageHeader, UpperCasePipe, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit{
  user : any;
  constructor(private authService : AuthService){}

  ngOnInit(): void {
    this.user = this.authService.getUser();
  }

}
