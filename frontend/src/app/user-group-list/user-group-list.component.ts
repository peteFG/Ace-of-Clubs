import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";

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

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get('/api/userGroup/')
      .subscribe((userGroups: UserGroup[]) => {
        this.userGroups = userGroups;
      })
  }


}
