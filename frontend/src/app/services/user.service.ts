import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {NavigationEnd, Router} from '@angular/router';
import {JwtHelperService} from '@auth0/angular-jwt';
import {filter, map} from 'rxjs/operators';
import {IMedia} from '../mediainput/mediainput.component';
import {GroupService} from './group.service';


export interface User {
  pk?: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  is_staff: boolean;
  group: string;
  is_active: boolean;
  date_joined: Date;
  pictures: IMedia;
}

export interface UserEvent {
  pk?: number;
  user: number;
  event: number;
  state: number;
  state_name:string;
}

export interface UserGroup {
  pk?: number;
  user: number;
  group: number;
  is_leader: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  readonly accessTokenLocalStorageKey = 'access_token';
  isLoggedIn = new BehaviorSubject(false);
  currentUserPK: number;
  currentUserName: string;
  clickedEvent: number;
  existingUserEntry: number;
  goahead: boolean;
  currentUser: User[];
  clickedUser: number;
  existingGroupEntry: number;
  availableGroups: number[];
  previousSite: string;
  previousUrl: string;


  constructor(private http: HttpClient,
              private router: Router,
              public groupService: GroupService,
              private jwtHelperService: JwtHelperService) {
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
    if (this.currentUser[0].is_staff === true) {
      return this.http.delete('/api/users/' + user.pk + '/');
    } else {
      alert('Users may only be deleted by Administrators!');
      /** TO DO: SONST ACCOUNT DEACTIVATEN UND
       * MIT HAS_PERMISSION ABFRAGEN OB DERJENIGE ADMIN IST!**/
    }
  }

  getUser(pk: number): Observable<User> {
    return this.http.get<User>('/api/users/' + pk + '/');
  }

  searchUserCustom(str: string): Observable<User[]> {
    return this.http.get<User[]>('/api/users/?search=' + str);
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
        this.retrieveCurrentUser();
        this.getPreviousSite(this.router);
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

  getCurrentUser(): Observable<User> {
    return this.http.get<User>('/api/user/').pipe(map((user)=>{
      return user[0];
    }));
  }

  retrieveCurrentUser(): void {
    this.getCurrentUser().subscribe((user) => {
      this.currentUser = [];
      this.currentUser.push(user);
      this.currentUserPK = 0;
      this.currentUserPK = user.pk;
    });
  }

  // PK des aktuell angemeldeten User in Variable speichern
  getCurrentUserId(): void {

    this.getCurrentUser().subscribe((user) => {
      this.currentUserPK = 0;
      this.currentUserPK = user.pk;
    });
  }

// ------------------------------------------ USER EVENT ------------------------------------------
  // alle UserEvents des aktuellen Users

  deleteUserEventEntry(userEvent: UserEvent): Observable<any> {
    return this.http.delete('/api/userEvent/' + userEvent.pk + '/');
  }

  getUserEventsOfCurrentUser(): Observable<UserEvent[]> {
    return this.http.get<UserEvent[]>('/api/userEvent/');
  }

  getUserEventsByUserID(iD: number): Observable<UserEvent[]> {
    return this.http.get<UserEvent[]>('/api/allUserEvents/?user=' + iD);
  }

  getAllUserEvents(): Observable<UserEvent[]> {
    return this.http.get<UserEvent[]>('/api/allUserEvents/');
  }

  setUserEventEntry(eventPK: number) {
    const entriesOfActualUser = this.getUserEventsOfCurrentUser();
    this.clickedEvent = eventPK;
    this.existingUserEntry = 0;
    let checkIfEmpty = [];

    entriesOfActualUser.subscribe((events) => {
      events.forEach((event) => {
        checkIfEmpty.push(event);
      });

      if (checkIfEmpty.length === 0) {
        this.router.navigateByUrl('/user-event-form/');
      } else {

        entriesOfActualUser.subscribe((userEvents) => {
          userEvents.forEach((eventEntry) => {
            if (eventEntry.event === eventPK) {

              this.existingUserEntry = eventEntry.pk;
              this.router.navigateByUrl('/user-event-form/' + this.existingUserEntry);

            }
            if (this.existingUserEntry === 0) {
              this.router.navigateByUrl('/user-event-form/');
            }

          });

        });

      }
    });


  }


  hasPermission(permission: string): boolean {
    const token = localStorage.getItem(this.accessTokenLocalStorageKey);
    if (token) {
      const decodedToken = this.jwtHelperService.decodeToken(token);
      const permissions = decodedToken.permissions;
      return permission in permissions;
    }
    return false;
  }


  // --------------------------------------  USER GROUP SERVICES -------------------------------------------
// User Groups for logged in user
  getUserGroupsByUserID(): Observable<UserGroup[]> {
    return this.http.get<UserGroup[]>('/api/userGroup/');
  }

  getUserGroupsByLeader(userID: number): Observable<UserGroup[]> {
    return this.http.get<UserGroup[]>('/api/userGroup/?leader=' + userID);
  }

// user Groups by user ID
  getUserGroupsByUsersPK(userID: number): Observable<UserGroup[]> {
    return this.http.get<UserGroup[]>('/api/allUserGroups/?user=' + userID);
  }

  getAllUserGroups(): Observable<UserGroup[]> {
    return this.http.get<UserGroup[]>('/api/allUserGroups/');
  }

  deleteUserGroupEntry(userGroup: UserGroup): Observable<any> {
    return this.http.delete('/api/allUserGroups/' + userGroup.pk + '/');
  }

  // funktion die nur jene  Gruppen ausgeben, denen der User noch nicht  angehört
  // diese Gruppen anschließend als input für userGroupForm
  // das heißt beim Button im User muss die UserID ausgelesen werden und zum filtern verwendet werden

  setUserGroupEntry() {
    this.groupService.getGroupPKs();
    const userID = this.clickedUser;
    this.availableGroups = [];
    const checkIfEmpty = [];
    const attendedGroups = []; // die Gruppen PKs, in denen sich der angeklickte User bereits befindet

    this.getUserGroupsByUsersPK(userID).subscribe((userGroups) => {
      userGroups.forEach((userGroup) => {
        checkIfEmpty.push(userGroup);
        attendedGroups.push(userGroup.group);
      });

      if (attendedGroups.length==0) {

        this.availableGroups = this.groupService.existingGroupsPK;

      } else {

        for (let elem of (this.groupService.existingGroupsPK)) {
          if (!attendedGroups.includes(elem)) {
            this.availableGroups.push(elem);
          }
        }
      }

      if (this.availableGroups.length != 0){
        this.router.navigateByUrl('/user-group-form');
      }else{
        this.availableGroups = this.groupService.existingGroupsPK;
        this.router.navigateByUrl('/user-group-form');
      }

    });
  }


  getPreviousSite(router: Router) {
    router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.previousUrl = event.url;
      });
  }

}
