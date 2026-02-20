import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { LoginRequest } from '../../models/login.model';
import { User } from '../../models/user.model';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'], 
  imports: [ReactiveFormsModule, NgIf ]
})

export class LoginComponent {

  loginForm: FormGroup;
  selectedRole: string = 'USER';

  errorMessage: string = '';
  loggedUser!: User;


  constructor(private fb: FormBuilder, private authService: AuthService, private cd : ChangeDetectorRef, private router : Router) {

    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

  }

  switchRole(role: string) {
    this.selectedRole = role;
    this.errorMessage = '';
    this.cd.detectChanges();
  }

  signup() {
    this.router.navigate(['./signup']);
  }

  login() {

    if (this.loginForm.invalid) return;

    const loginData: LoginRequest = this.loginForm.value;

    this.authService.login(loginData).subscribe({

      next: (res: User) => {

        // ROLE BASED CHECK
        if (res.role !== this.selectedRole) {
          this.errorMessage = "Wrong panel selected. Try " + res.role + " login.";
          this.cd.detectChanges();
          return;
        }

        this.loggedUser = res;
        this.authService.setUser(res);

        this.errorMessage = '';

        //Role based redirect
        if(res.role === 'USER') {
          this.router.navigate(['/']);
        }

        else if (res.role === 'ADMIN') {
          this.router.navigate(['./admin']);
        }

        console.log("Logged in user:", res);
        this.cd.detectChanges();

      },

      error: (err) => {
        this.errorMessage = err.error?.message || "Login failed from server";
        this.cd.detectChanges();
      }
    });
  }
}