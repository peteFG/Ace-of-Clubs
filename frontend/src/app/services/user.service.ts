import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {Router} from "@angular/router";
import {JwtHelperService} from '@auth0/angular-jwt';




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

  readonly accessTokenLocalStorageKey = 'access_token';
  isLoggedIn = new BehaviorSubject(false);
  currentUserPK:number;


  constructor(private http: HttpClient, private router: Router, private jwtHelperService: JwtHelperService) {
    const token = localStorage.getItem(this.accessTokenLocalStorageKey);
    if (token) {
      console.log('Token expiration date: ' + this.jwtHelperService.getTokenExpirationDate(token));
      const tokenValid = !this.jwtHelperService.isTokenExpired(token);
      this.isLoggedIn.next(tokenValid);
    }
  }


  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users/');
  }

  deleteUser(user: User): Observable<any> {
    return this.http.delete('/api/users/' + user.pk + '/');
  };

  getUser(pk: number): Observable<User> {
    return this.http.get<User>('/api/users/' + pk + '/');
  }

  updateUser(user: User): Observable<any> {
    return this.http.patch('/api/users/' + user.pk + '/', user);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>('/api/users/', user);
  }

  login(userData: { username: string, password: string }): void {
    this.http.post('/api/api-token-auth/', userData)
      .subscribe((res: any) => {
        this.isLoggedIn.next(true);
        localStorage.setItem('currentUser', userData.username);
        localStorage.setItem('access_token', res.token);
        this.router.navigate(['event-list']);
        this.cUID();
        alert('Logged in as: ' + localStorage.getItem('currentUser'))
      }, () => {
        alert('wrong username or password');
      });
  }

  logout(): void {
    localStorage.removeItem(this.accessTokenLocalStorageKey);
    localStorage.removeItem('currentUser');
    this.isLoggedIn.next(false);
    this.router.navigate(['/login']);

  }


  getCurrentUser(): Observable<User> {
    return this.http.get<User>('/api/users/?username=' + localStorage.getItem('currentUser'));
  }

  cUID():void{
    this.getCurrentUser().
    subscribe((user)=>{
      this.currentUserPK = user[0].pk
    })
  }


}
