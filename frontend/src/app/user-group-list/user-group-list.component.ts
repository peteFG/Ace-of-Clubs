import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {UserGroup, UserService} from '../services/user.service';

@Component({
  selector: 'app-user-group-list',
  templateUrl: './user-group-list.component.html',
  styleUrls: ['./user-group-list.component.scss']
})
export class UserGroupListComponent implements OnInit {

  userGroups: UserGroup[];
  displayedColumns = ['user', 'group', 'is_leader', 'delete']

  constructor(private http: HttpClient,
              private route: ActivatedRoute,
              public userService: UserService) { }

  ngOnInit(): void {
    this.userService.retrieveCurrentUser();

    const pkFromUrl = this.route.snapshot.paramMap.get('pk');
    if(pkFromUrl) {
      this.userService.getUserGroupsByUsersPK(parseInt(pkFromUrl,10))
        .subscribe((groups) => {
          this.userGroups  =  [];
          this.userGroups = groups;
        });
    }
    else {
      this.retrieveUserGroupEntries();

    }

  }

  retrieveUserGroupEntries(): void {
    this.userService.getAllUserGroups()
      .subscribe((uGroups)=>{
      this.userGroups = uGroups
    });
  }

  deleteUserGroupEntry(entry: UserGroup): void {
    this.userService.deleteUserGroupEntry(entry).subscribe(()=>{
      const pkFromUrl = this.route.snapshot.paramMap.get('pk');
      if(pkFromUrl) {
        this.userService.getUserGroupsByUsersPK(parseInt(pkFromUrl,10))
          .subscribe((groups) => {
            this.userGroups = groups;
            alert('deleted successfully!');
          });
      }else {
        this.retrieveUserGroupEntries();
        alert('deleted successfully!');
      }
    })
  }
}
