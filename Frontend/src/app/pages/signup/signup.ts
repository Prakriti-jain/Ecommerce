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
      name:['', Validators.required],
      dob:['', Validators.required],
      gender:['', Validators.required],
      username:['', Validators.required],
      password:['', Validators.required],
      address:['', Validators.required],
      phone:['']
    });
  }

  signup() {

    if(this.signupForm.invalid) return;

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
