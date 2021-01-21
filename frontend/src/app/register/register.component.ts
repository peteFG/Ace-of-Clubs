import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {UserService} from '../services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {first} from 'rxjs/operators';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  constructor(private userService: UserService,
              private router: Router,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private fb: FormBuilder
  ) {
  }

  registerFormGroup: FormGroup;

  ngOnInit(): void {
    this.registerFormGroup = this.fb.group({
      pk: ['', Validators.required],
      username: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      password2: ['', Validators.required],
      is_active: new FormControl(false),
      is_staff: new FormControl(false),
      groups: new FormControl([2]),
    }, {validators: this.passwordMatchValidator});
  }


  /* Shorthands for form controls (used from within template) */
  get password() { return this.registerFormGroup.get('password'); }
  get password2() { return this.registerFormGroup.get('password2'); }

  /* Called on each input in either password field */
  onPasswordInput() {
    if (this.registerFormGroup.hasError('passwordMismatch')) {
      this.password2.setErrors([{passwordMismatch: true}]);
    }
    else {
      this.password2.setErrors(null);
    }
  }

  passwordMatchValidator: ValidatorFn = (formGroup: FormGroup): ValidationErrors | null => {
    if (formGroup.get('password').value === formGroup.get('password2').value) {
      return null;
    }
    else {
      return {passwordMismatch: true};
    }
  }

  createOrUpdateUser(): void {
    this.userService.createUser(this.registerFormGroup.value)
      .pipe(first())
      .subscribe(
        data => {
          alert('User Registered successfully!!');
          this.router.navigate(['/login']);
        },
        (error) => {
          alert('Ups! Something went wrong. \n Check your login credentials. \n (Maybe the Username is already taken!)');
        });

  }
}
