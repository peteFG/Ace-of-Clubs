import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import { Router } from '@angular/router';
import {JwtHelperService} from '@auth0/angular-jwt';
import {isEmpty, map} from 'rxjs/operators';
import {flatMap} from 'rxjs/internal/operators';
import {IMedia} from '../mediainput/mediainput.component';
import {Group, GroupService} from "./group.service";




export interface User {
  pk?: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  is_staff: boolean;
  is_active: boolean;
  date_joined: Date;
  profile_picture: IMedia;
}

export interface UserEvent {
  pk?: number;
  user: number;
  event: number;
  state: number;
  // profile_picture: Media;
}

export interface UserGroup{
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


  constructor(private http: HttpClient,
              private router: Router,
              public groupService:GroupService,
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
    if (this.currentUserPK === 1) {
      return this.http.delete('/api/users/' + user.pk + '/');
    } else {
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
        this.retrieveCurrentUser();
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
      .pipe(map((users) => {
        return users[0];
      }));
  }

// bekommt vom Backend noch  den  falschen User!!!! --> vermuute den aktuell angemeldeten im backend (ADMIN)

  /*
  getCurrentUser():Observable<User>{
    return this.http.get<User>('/api/user/');
  }
  *
   */

  retrieveCurrentUser(): void {
    this.getCurrentUser().subscribe((user) => {
      this.currentUser = [];
      this.currentUser.push(user);
      this.currentUserPK = 0;
      this.currentUserPK = user.pk;
      //console.log(user);
      //console.log(user.pk);
    });
  }

  // PK des aktuell angemeldeten User in Variable speichern
  getCurrentUserId(): void {

    this.getCurrentUser().
    subscribe((user) => {
      this.currentUserPK = 0;
      this.currentUserPK = user.pk;
    });
  }
// ------------------------------------------ USER EVENT ------------------------------------------
  // alle UserEvents des aktuellen Users

  deleteUserEventEntry(userEvent: UserEvent): Observable<any> {
    return this.http.delete('/api/userEvent/' + userEvent.pk + '/');
  }

  getUserEventsOfCurrentUser(): Observable<UserEvent[]>{
    return this.http.get<UserEvent[]>('/api/userEvent/?user=');
  }

  getAllUserEvents(): Observable<UserEvent[]>{
    return this.http.get<UserEvent[]>('/api/allUserEvents/');
  }

  setUserEventEntry(eventPK: number) {
    const entriesOfActualUser = this.getUserEventsOfCurrentUser();
    this.clickedEvent =  eventPK;
    // this.getCurrentUserId();
    this.existingUserEntry = 0;
    // alert('Object was pressed - ID of Event =' + eventPK)
    let checkIfEmpty = [];

    entriesOfActualUser.subscribe((events) => {
      events.forEach((event) => {
        checkIfEmpty.push(event);
      });

      if (checkIfEmpty.length == 0){
        this.router.navigateByUrl('/user-event-form/');
      } else {

        entriesOfActualUser.subscribe((userEvents) => {
          userEvents.forEach((eventEntry) => {
            if(eventEntry.event == eventPK){

              this.existingUserEntry = eventEntry.pk;
              this.router.navigateByUrl('/user-event-form/' + this.existingUserEntry);

            }
            if (this.existingUserEntry == 0){
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

  getUserGroupsByUserID(): Observable<UserGroup[]> {
    return this.http.get<UserGroup[]>('/api/userGroup/');
  }

  getUserGroupsByUsersPK(userID:number): Observable<UserGroup[]>{
    return this.http.get<UserGroup[]>('/api/allUserGroups/?user='+userID);
  }

  getAllUserGroups(): Observable<UserGroup[]>{
    return this.http.get<UserGroup[]>('/api/allUserGroups/');
  }

  deleteUserGroupEntry(userGroup: UserGroup): Observable<any> {
    return this.http.delete('/api/allUserGroups/' + userGroup.pk + '/');
  }

  // funktion die nur jene  Gruppen ausgeben, denen der User noch nicht  angehört
  // diese Gruppen anschließend als input für userGroupForm
  // das heißt beim Button im User muss die UserID ausgelesen werden und zum filtern verwendet werden

  setUserGroupEntry(){
    this.groupService.getGroupPKs();
    const userID = this.clickedUser
    const entriesOfClickedUser = this.getUserGroupsByUsersPK(userID);
    //this.clickedUser = userID;
    this.availableGroups =[];
    //  this.groupService.existingGroupsPK --> hier sind die PKs der aktuell existierenden Gruppen verspeichert
    //this.clickedUser = userID;
    this.existingGroupEntry = 0;
    const checkIfEmpty=[];
    const attendedGroups=[]; // die Gruppen PKs, in denen sich der angeklickte User bereits befindet

    entriesOfClickedUser.subscribe((userGroups)=>{
      userGroups.forEach((userGroup)=>{
        checkIfEmpty.push(userGroup);
        attendedGroups.push(userGroup.group);
      });

      // dapasst noch was nicht --> wenn  attended leer --> dann bekommt er iwie keine existing  Groups
      // eig net so tragisch, da jede/r in der ALL Gruppe sein sollte
      if(attendedGroups.length==0){

        //this.availableGroups.concat(this.groupService.existingGroupsPK);
        this.availableGroups = this.groupService.existingGroupsPK;

      } else {

        for (let elem of (this.groupService.existingGroupsPK)){
          if (!attendedGroups.includes(elem)){
            this.availableGroups.push(elem);
          }
        }
      }
/*

      if(checkIfEmpty.length==0){
        this.router.navigateByUrl('/user-group-form/');
      } else {

        entriesOfActualUser.subscribe((userGroups)=>{
          userGroups.forEach((userGroupEntry)=>{

        })

      });

    }
      */

  });

    this.router.navigateByUrl('/user-group-form/');

    console.log(this.availableGroups)
    console.log(this.clickedUser)
  }

  /*
  getFilteredGroups(): Observable<Group[]>{

    const

  }

   */
}
