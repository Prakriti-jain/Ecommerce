import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.html',
  styleUrls: ['./signup.css'], 
  imports: [ ReactiveFormsModule,NgIf , RouterLink] 
})
export class SignupComponent {

  signupForm: FormGroup;
  errorMessage:string='';

  constructor(private fb:FormBuilder,
              private authService:AuthService,
              private router:Router){

    this.signupForm = this.fb.group({
      name:['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z ]+$')]],
      dob:['', Validators.required],
      gender:['', Validators.required],
      username:['', [Validators.required, Validators.minLength(4), Validators.maxLength(20), , Validators.pattern('^[a-zA-Z0-9]+$')]],
      password:['', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])$')]],
      address:['', Validators.required],
      phone:['', Validators.pattern('^\\d{10}$')]
    });
  }

  signup() {

    if(this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.signupForm.value,
      role:'USER'
    };

    console.log(payload);

    this.authService.signup(payload).subscribe({

      next:(res)=>{
        alert("Account created successfully!");
        this.router.navigate(['/login']);
      },

      error:(err)=>{
        this.errorMessage = err.error?.message || "Signup failed";
      }
    });
  }
}
