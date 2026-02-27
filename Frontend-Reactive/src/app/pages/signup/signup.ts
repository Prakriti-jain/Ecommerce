import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, catchError, EMPTY, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.html',
  styleUrls: ['./signup.css'], 
  imports: [ ReactiveFormsModule,NgIf , RouterLink, AsyncPipe] 
})
export class SignupComponent {

  signupForm: FormGroup;
  errorMessage$ = new BehaviorSubject<string>('');
  private signupTrigger$ = new Subject<any>();
  signupResult$! : Observable<any>;

  constructor(private fb:FormBuilder,
              private authService:AuthService,
              private router:Router){

    this.signupForm = this.fb.group({
      name:['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z ]+$')]],
      dob:['', Validators.required],
      gender:['', Validators.required],
      username:['', [Validators.required, Validators.minLength(4), Validators.maxLength(20),  Validators.pattern('^[a-zA-Z0-9]+$')]],
      password:['', [Validators.required, Validators.minLength(8), 
      // Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])$')
      ]],
      address:['', Validators.required],
      phone:['', Validators.pattern('^\\d{10}$')]
    });
  }

  ngOnInit() {
    this.signupResult$ = this.signupTrigger$.pipe(
      switchMap(payload => this.authService.signup(payload).pipe(
        tap(() => {
          alert("Account created successfully")
          this.router.navigate(['/login']);
        }),
        catchError(err => {
          this.errorMessage$.next(err.error?.message || err.error || "Signup failed");
          return EMPTY;
        })
      ))
    )
  }

  signup() {
    if(this.signupForm.invalid) {
      this.errorMessage$.next("Invalid Form! Fill the Required fields")
      return;
    }

    const payload = {
      ...this.signupForm.value,
      role:'USER'
    };

    this.signupTrigger$.next(payload)
  }
}
