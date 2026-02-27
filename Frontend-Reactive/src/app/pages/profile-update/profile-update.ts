import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PageHeader } from '../../shared/page-header/page-header';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { BehaviorSubject, catchError, EMPTY, Observable, Subject, switchMap, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-profile-update',
  imports: [PageHeader, ReactiveFormsModule, NgIf, AsyncPipe],
  templateUrl: './profile-update.html',
  styleUrl: './profile-update.css',
})
export class ProfileUpdate implements OnInit{
  form !: FormGroup;
  user : any;

  private updateTrigger$ = new Subject<any>();
  updateResults$! : Observable<any>;
  errorMessage$ = new BehaviorSubject<string>('');

  constructor(private router : Router, private fb:FormBuilder, private auth:AuthService, private cd : ChangeDetectorRef){}

  ngOnInit(){
    this.user = this.auth.getUser();

    this.form = this.fb.group({
      name:[this.user.name , [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z ]+$')]],
      phone:[this.user.phone, Validators.pattern('^\\d{10}$')],
      address:[this.user.address, Validators.required],
      gender:[this.user.gender, Validators.required],
      dob:[this.user.dob, Validators.required]
    });

    this.updateResults$ = this.updateTrigger$.pipe(
      switchMap(data => this.auth.updateProfile(this.user.id, data).pipe(
        tap(() => {
          alert("Profile updated");
          this.router.navigate(['/profile']);
        }), 
        catchError(err => {
          this.errorMessage$.next(err.error?.message || err.error || "Signup failed");
          return EMPTY;
        })
      )
    ))
  }

  update(){
    if(this.form.invalid) {
      this.errorMessage$.next("Invalid Form! Fill the Required fields")
      return;
    }

    const data = this.form.value;
    this.updateTrigger$.next(data);
  }
}
