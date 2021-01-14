import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserService} from "./user.service";
import {Group} from "./group.service";

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

  userGroupsByUserID: UserGroup[];
  groupsPKByUserID:number[];

  constructor(private http: HttpClient, private userService: UserService) { }

  //Gruppen gefiltert durch die UserID (UserGroup)
  getUserGroupsByUserID(userID: number): Observable<UserGroup[]> {
    return this.http.get<UserGroup[]>('/api/userGroup/?user=' + userID);
  }

  gGBUID():void{
    this.groupsPKByUserID = [];
    this.getUserGroupsByUserID(this.userService.currentUserPK).
    subscribe((userGroups)=>{
      userGroups.forEach((userGroup)=>{
        this.groupsPKByUserID.push(userGroup.group)
      })

    })
  }
}
