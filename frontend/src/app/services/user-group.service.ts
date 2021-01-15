import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserService} from "./user.service";
import {Group} from "./group.service";
import {map} from "rxjs/operators";
import {flatMap} from "rxjs/internal/operators";
import {group} from "@angular/animations";

export interface UserGroup{
  pk?: number;
  user: number;
  group: number;
  is_leader: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserGroupService {

  //userGroupsByUserID: UserGroup[];

  constructor(private http: HttpClient, private userService: UserService) { }

  //Gruppen gefiltert durch die UserID (UserGroup)
  getUserGroupsByUserID(userID: number): Observable<UserGroup[]> {
    return this.http.get<UserGroup[]>('/api/userGroup/?user=' + userID);
  }

 /*


gGBUID(): Observable<UserGroup[]>{
    return this.userService.getCurrentUser()
      .pipe(flatMap((currentUser)=>{
        return this.getUserGroupsByUserID(currentUser.pk)
    }));
  }

  */

  gGBUID(): Observable<UserGroup[]>{
    return this.userService.getCurrentUser()
      .pipe(flatMap((currentUser)=>{
        return this.getUserGroupsByUserID(currentUser.pk)
      }));
  }

}
