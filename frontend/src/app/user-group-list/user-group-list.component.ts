import { Component, OnInit } from '@angular/core';
import {EventService} from "../services/event.service";
import {Time} from "@angular/common";
import {HttpClient} from "@angular/common/http";
import {UserService} from "../services/user.service";
import {UserGroupService} from "../services/user-group.service";

interface UserGroup {
  pk?: number;
  user: string;
  group: string;
  is_leader: boolean;
}

@Component({
  selector: 'app-user-group-list',
  templateUrl: './user-group-list.component.html',
  styleUrls: ['./user-group-list.component.scss']
})
export class UserGroupListComponent implements OnInit {

  userGroups: UserGroup[];
  //displayedColumns = ['ev_type', 'name', 'start_time', 'end_time', 'start_date', 'end_date', 'active', 'group']

  constructor(private http: HttpClient, userService: UserService, private userGroupService: UserGroupService, private eventService: EventService) { }

  ngOnInit(): void {
    this.http.get('/api/userGroup/')
      .subscribe((userGroups: UserGroup[]) => {
        this.userGroups = userGroups;
      })

    alert(this.userGroupService.groupsPKByUserID)
    alert(this.eventService.personalEvents)
  }


}
