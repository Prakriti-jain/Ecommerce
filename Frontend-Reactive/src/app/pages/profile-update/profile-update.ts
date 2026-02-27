import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PageHeader } from '../../shared/page-header/page-header';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-update',
  imports: [PageHeader, ReactiveFormsModule],
  templateUrl: './profile-update.html',
  styleUrl: './profile-update.css',
})
export class ProfileUpdate implements OnInit{
  form !: FormGroup;
  user : any;

  constructor(private router : Router, private fb:FormBuilder, private auth:AuthService, private cd : ChangeDetectorRef){}

  ngOnInit(){
    this.user = this.auth.getUser();

    this.form = this.fb.group({
      name:[this.user.name],
      phone:[this.user.phone],
      address:[this.user.address],
      gender:[this.user.gender],
      dob:[this.user.dob]
    });
  }

  update(){
    this.auth.updateProfile(this.user.id, this.form.value)
    .subscribe({
      next : (res : any) => {
        // this.auth.setUser(res);
        alert("Profile updated");
        this.cd.detectChanges();
        this.router.navigate(['/profile']);
      }
    });
  }
}
