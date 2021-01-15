import { Component, OnInit } from '@angular/core';
import {Group, GroupService} from '../services/group.service';
import {UserService} from '../services/user.service';
import {HttpClient} from '@angular/common/http';
import {EventService} from "../services/event.service";



@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent implements OnInit {

  groups: Group[];
  displayedColumns = ['name', 'leader', 'edit', 'delete'];

  constructor(private http: HttpClient,
              private groupService: GroupService,
              private eventService: EventService,
              public userService: UserService) { }


  ngOnInit(): void {
    this.retrieveGroups();
  }

  private retrieveGroups(): void {
    this.groupService.retrieveGroups()
      .subscribe((groups) => {
        this.groups = groups;
    });
  }

  deleteGroup(group: Group): void {
    if (localStorage.getItem('currentUser') == group.leader || localStorage.getItem('currentUser') == "admin") {
      this.groupService.deleteGroup(group)
        .subscribe(() => {
          this.retrieveGroups();
          alert('deleted successfully!');
        });
    }
    else {
      alert('You do not have permission to perform this action.');
    }
  }
}
