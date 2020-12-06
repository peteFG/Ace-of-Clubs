import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {Router} from "@angular/router";
//import {JwtHelperService} from '@auth0/angular-jwt'

export interface User {
  pk?: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  is_staff: boolean;
  is_active: boolean;
  date_joined: Date;
  //profile_picture: Media;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private http: HttpClient){

  }


  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users/');
  }

  deleteUser(user: User): Observable<any> {
    return this.http.delete('/api/users/' + user.pk + '/');
  }

  getUser(pk: number): Observable<User> {
    return this.http.get<User>('/api/users/' + pk + '/');
  }

  updateUser(user: User): Observable<any> {
    return this.http.patch('/api/users/' + user.pk + '/', user);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>('/api/users/', user);
  }
}
