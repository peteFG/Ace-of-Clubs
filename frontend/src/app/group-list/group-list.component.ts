import { Component, OnInit } from '@angular/core';
import {Group, GroupService} from '../services/group.service';
import {HttpClient} from '@angular/common/http';



@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent implements OnInit {

  groups: Group[];
  groupService: GroupService;
  // displayedColumns = ['ev_type', 'name', 'start_time', 'end_time', 'start_date', 'end_date', 'active', 'group']

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get('/api/group/')
      .subscribe((groups: Group[]) => {
        this.groups = groups;
      });

    this.retrieveGroups();

  }

  private retrieveGroups(): void {
    this.groupService.retrieveGroups()
      .subscribe((groups) => {
        this.groups = groups;
    });
  }

  deleteEvent(group: Group): void {
    this.groupService.deleteGroup(group)
      .subscribe(() => {
        this.retrieveGroups();
        alert('deleted successfully!');
      });
  }
}
