import {Component} from '@angular/core';
import {UserService} from "./services/user.service";



class AuthenticationService {
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public userService: UserService) {
  }
  title = 'frontend';
}
