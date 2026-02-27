import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../models/login.model';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/auth'; //springboot url
  
  //one Behaviour Subject and one Observable so that no component can change the value of the user and can only access to observable 
  private userSubject = new BehaviorSubject<User | null> (this.getStoredUser()); 
  user$ = this.userSubject.asObservable();


  constructor(private http : HttpClient) {}

  getStoredUser() : User | null {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser): null;
  }

  login(data:LoginRequest) : Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/login`, data).pipe(
      tap(user => {
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
      })
    );
  }

  getUser(){
    return this.userSubject.value;
  }

  logout() {
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  isLogged(){
    // return this.currentUser != null;
    return this.userSubject.value != null;
  }

  signup(data : any) {
    return this.http.post('http://localhost:8080/auth/signup', data);
  }

  updateProfile(userId:number,data:any){
  return this.http.put(`http://localhost:8080/auth/update/${userId}`,data).pipe(
    tap((updatedUser : any) => {
      localStorage.setItem('user', JSON.stringify(updatedUser));
      this.userSubject.next(updatedUser);
    })
  );
}

}
