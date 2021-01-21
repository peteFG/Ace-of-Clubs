import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User, UserService} from '../services/user.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  userProfile: User[];
  displayedColumns = ['pictures' , 'username', 'email', 'first_name', 'last_name', 'edit', 'delete'];

  constructor(private http: HttpClient, private userService: UserService) { }

  ngOnInit(): void {
    this.retrieveUser();
  }

  private retrieveUser(): void {

    this.userService.getCurrentUser().subscribe((user)=>{
      this.userProfile=[];
      this.userProfile.push(user);
    });
  }

/** VERWENDEN WENN BACKEND PROBLEM BESEITIGT */
  /*private retrieveUser(): void {

    this.userService.getCurrentUser().subscribe((user)=>{

      this.userProfile= user;
    });
  }*/

  /** Delete User funktioniert noch nicht mit deactivate. Temporärer fix ->
   * Wenn Kein Admin wird HTML Feld nicht angezeigt.
   */

  deleteUser(user: User): void {
    // if (this.userService.currentUserPK == 1) {
    this.userService.deleteUser(user)
      .subscribe(() => {
        this.retrieveUser();
        alert('deleted successfully!');
      });
  }
}




