import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { LoginRequest } from '../../models/login.model';
import { User } from '../../models/user.model';
import { ReactiveFormsModule } from '@angular/forms';
import {CommonModule } from '@angular/common';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, Observable, switchMap, tap, catchError, of} from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.css'], 
  imports: [CommonModule, ReactiveFormsModule, AsyncPipe]
})

export class LoginComponent {

  loginForm: FormGroup;
  selectedRole: string = 'USER';

  errorMessage$ = new BehaviorSubject<string>('');
  loggedUser!: User;

  private loginTrigger$ = new Subject<any>();
  loginResult$! : Observable<any>;


  constructor(private fb: FormBuilder, private authService: AuthService, private router : Router) {

    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

  }

  ngOnInit() {
    this.loginResult$ = this.loginTrigger$.pipe(
      switchMap(loginForm => this.authService.login(loginForm).pipe(
        tap((res : User) => {
          if (res.role !== this.selectedRole) {
            console.log("error!!!")
            this.errorMessage$.next("Wrong panel selected. Try " + res.role + " login.");
            return;
        }

        this.loggedUser = res;
        this.authService.setUser(res);
        this.errorMessage$.next('');

        //Role based redirect
        if(res.role === 'USER') {
          this.router.navigate(['/']);
        } else if (res.role === 'ADMIN') {
          this.router.navigate(['./admin']);
        }

        console.log("Logged in user:", res);

        }),

        catchError(err => {
          this.errorMessage$.next(err.error?.message || "Login failed from server");
          return of(null);
        })
      ))
    )
  }

  switchRole(role: string) {
    this.selectedRole = role;
    this.errorMessage$.next('');
  }

  signup() {
    this.router.navigate(['./signup']);
  }

  login() {

    if (this.loginForm.invalid) {
      this.errorMessage$.next("Invalid Form! Fill the Required fields")
      return;
    }

    const loginData: LoginRequest = this.loginForm.value;

    this.loginTrigger$.next(loginData);


    // this.authService.login(loginData).subscribe({

    //   next: (res: User) => {

    //     // ROLE BASED CHECK
    //     if (res.role !== this.selectedRole) {
    //       console.log("error!!!")
    //       this.errorMessage$.next("Wrong panel selected. Try " + res.role + " login.");
    //       // this.cd.detectChanges();
    //       return;
    //     }

    //     this.loggedUser = res;
    //     this.authService.setUser(res);

    //     this.errorMessage$.next('');

    //     //Role based redirect
    //     if(res.role === 'USER') {
    //       this.router.navigate(['/']);
    //     }

    //     else if (res.role === 'ADMIN') {
    //       this.router.navigate(['./admin']);
    //     }

    //     console.log("Logged in user:", res);

    //   },

    //   error: (err) => {
    //     console.log("ERROR HIT");
    //     this.errorMessage$.next(err.error?.message || "Login failed from server");
    //   }
    // });
  }
}