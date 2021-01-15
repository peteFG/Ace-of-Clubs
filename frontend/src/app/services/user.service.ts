import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import { Router } from "@angular/router";
import {JwtHelperService} from '@auth0/angular-jwt';
import {Group} from "./group.service";
import {UserGroupService} from "./user-group.service";
import {map} from "rxjs/operators";




export interface User {
  pk?: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  is_staff: boolean;
  is_active: boolean;
  date_joined: Date;
  // profile_picture: Media;
}

export interface UserEvent {
  pk?: number;
  user: number;
  event: number;
  state: number;
  //profile_picture: Media;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  readonly accessTokenLocalStorageKey = 'access_token';
  isLoggedIn = new BehaviorSubject(false);
  currentUserPK:number;
  currentUserName:string;
  clickedEvent:number;
  existingUserEntry:number;
  goahead:boolean;


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
    if (this.currentUserPK != 1) {
      return this.http.delete('/api/users/' + user.pk + '/');
    }
    else {
      alert('Users may only be deleted by Administrators!');
      /** TO DO: SONST ACCOUNT DEACTIVATEN UND
      * MIT HAS_PERMISSION ABFRAGEN OB DERJENIGE ADMIN IST!**/
    }
  }

  /*deactivateUser(user: User): Observable<any> {
    return this.http.delete('/api/users/' + user.pk + '/');
  };*/

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
        this.getCurrentUserId();
        alert('Logged in as: ' + localStorage.getItem('currentUser'));
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


  // Aktuell angemeldeten User mittels username ermitteln
  getCurrentUser(): Observable<User> {
    return this.http.get<User[]>('/api/users/?username=' + localStorage.getItem('currentUser'))
      .pipe(map((users)=>{
        return users[0];
      }));
  }
  // PK des aktuell angemeldeten User in Variable speichern
  getCurrentUserId(): void {
    this.getCurrentUser().
    subscribe((user)=>{
      this.currentUserPK = user.pk
    })
  }

  //alle UserEvents des aktuellen Users

  getUserEventsOfCurrentUser(): Observable<UserEvent[]>{
    return this.http.get<UserEvent[]>('/api/userEvent/?user=');
  }

  setUserEventEntry(eventPK:number) {
    this.clickedEvent =  eventPK
    this.existingUserEntry = 0
    //alert('Object was pressed - ID of Event =' + eventPK)
    var entriesOfActualUser = this.getUserEventsOfCurrentUser()

    entriesOfActualUser.subscribe((userEvents)=>{

      userEvents.forEach((eventEntry)=>{

        if(eventEntry.event == eventPK){

          this.existingUserEntry = eventEntry.pk;

         this.router.navigateByUrl('/user-event-form/'+this.existingUserEntry)

        }
        if (this.existingUserEntry ==0){
          this.router.navigateByUrl('/user-event-form/')
        }

      })

    })

  }

  /*setPersonalEntry(eventPK:number):number{

    var entriesOfActualUser = this.getUserEventsOfCurrentUser()
    var personalEntryPK=0
    entriesOfActualUser.subscribe((userEvents)=>{

      userEvents.forEach((eventEntry)=>{

        if(eventEntry.event == eventPK){

          personalEntryPK = eventEntry.pk;
          //this.goahead = true;

        } else {

        }

      })

    })
    return personalEntryPK

  }*/

  hasPermission(permission: string): boolean {
    const token = localStorage.getItem(this.accessTokenLocalStorageKey);
    if (token) {
      const decodedToken = this.jwtHelperService.decodeToken(token);
      const permissions = decodedToken.permissions;
      return permission in permissions;
    }
    return false;
  }

}
