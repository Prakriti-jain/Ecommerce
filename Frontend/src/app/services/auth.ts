import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../models/login.model';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/auth'; //springboot url
  private currentUser : User | null = null;

  constructor(private http : HttpClient) {}

  login(data:LoginRequest) : Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/login`, data);
  }

  setUser(user : User) {
    this.currentUser = user;
  }

  getUser() {
    return this.currentUser;
  }

  logout() {
    this.currentUser = null;
  }

  isLogged(){
    return this.currentUser != null;
  }

  signup(data : any) {
    return this.http.post('http://localhost:8080/auth/signup', data);
  }

  updateProfile(userId:number,data:any){
  return this.http.put(`http://localhost:8080/auth/update/${userId}`,data);
}

}
