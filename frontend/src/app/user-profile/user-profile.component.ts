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
  displayedColumns = ['username', 'email', 'first_name', 'last_name', 'edit', 'delete'];

  constructor(private http: HttpClient, private userService: UserService) { }

  ngOnInit(): void {
    /*this.userFormGroup = new FormGroup({
      pk: new FormControl(),
      username: new FormControl(),
      first_name: new FormControl(),
      last_name: new FormControl(),
      is_active: new FormControl(),
      pictures: new FormControl([]),
    });*/
    this.retrieveUser();
  }


  private retrieveUser(): void {

    this.userService.getCurrentUser().subscribe((user) => {
      this.userProfile = [];
      this.userProfile.push(user);
    });

    /*this.userService.getCurrentUser().subscribe((user)=>{

      this.userProfile= user;
    });*/

  }

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
    // }
    /*else {
      this.userService.updateUser(user)
        .subscribe((is_active = false) => {
          this.userFormGroup.patchValue(is_active);
          alert('Updated status to false')
        });
    }*/
  }
}




