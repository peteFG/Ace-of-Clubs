import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User, UserService} from "../services/user.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  userProfile: User[];
  displayedColumns = ['username', 'email', 'first_name', 'last_name', 'edit','delete']

  constructor(private http: HttpClient, private userService: UserService) { }

  ngOnInit(): void {
    this.retrieveUser();
  }


  private retrieveUser(): void {

    this.userService.getCurrentUser().subscribe((user)=>{
      this.userProfile=[]
      this.userProfile.push(user);
    });
  }

  deleteUser(user: User): void {
    this.userService.deleteUser(user)
      .subscribe(() => {
        this.retrieveUser();
        alert('deleted successfully!');
      });
  }
}




