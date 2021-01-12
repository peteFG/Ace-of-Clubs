import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginFormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router,
              private userService: UserService) {

  }

  ngOnInit(): void {
    this.loginFormGroup = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login(): void {
    this.userService.login(this.loginFormGroup.value);
  }

}
