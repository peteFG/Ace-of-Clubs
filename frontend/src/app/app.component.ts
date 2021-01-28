import {Component, OnInit} from '@angular/core';
import {User, UserService} from './services/user.service';
import {Router} from '@angular/router';



class AuthenticationService {
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'frontend';
  isLoggedIn = false;
  isStaff = false;
  userProfile: User[];
  //currentUser: any;

  currentUserName: any;
  currentUserFN: any;
  currentUserLN: any;
  currentUserPic: any;

  constructor(public userService: UserService,
              private router: Router) {
  }

  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.userService.isLoggedIn.subscribe(response => {
      this.isLoggedIn = response;
    });

    //this.retrieveUser();

    //this.currentUser = this.userService.retrieveCurrentUser();
    this.userService.getPreviousSite(this.router);
  }

  private retrieveUser(): void {

    this.userService.getCurrentUser().subscribe((user) => {
      this.userProfile = [];
      this.userProfile.push(user);
      this.isStaff = user.is_staff;
    });
  }

}
