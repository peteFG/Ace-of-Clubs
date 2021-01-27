import { Component, OnInit } from '@angular/core';
import {Group, GroupService} from '../services/group.service';
import {UserService} from '../services/user.service';
import {HttpClient} from '@angular/common/http';
import {EventService} from '../services/event.service';
import {MatDialog} from '@angular/material/dialog';
import {GroupFormComponent} from '../group-form/group-form.component';


@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent implements OnInit {

  groups: Group[];
  displayedColumns = ['name', 'leader', 'actions'];

  constructor(private http: HttpClient,
              private groupService: GroupService,
              private eventService: EventService,
              public userService: UserService,
              public dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.retrieveGroups();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(GroupFormComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog result ${result');
    });
  }

  private retrieveGroups(): void {
    this.groupService.retrieveGroups()
      .subscribe((groups) => {
        this.groups = groups;
    });
  }

  deleteGroup(group: Group): void {
    if (this.userService.currentUser[0].is_staff) {
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
