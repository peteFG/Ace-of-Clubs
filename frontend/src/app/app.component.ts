import {Component, OnInit} from '@angular/core';
import {UserService} from './services/user.service';



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

  constructor(public userService: UserService) {
  }

  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.userService.isLoggedIn.subscribe(response => {
      this.isLoggedIn = response;
    });
  }

}
