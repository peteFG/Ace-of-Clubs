import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {User, UserService} from '../services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  constructor(private userService: UserService,
              private router: Router,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private fb: FormBuilder) {
  }

  user: Observable<User>;
  changePasswordFormGroup: FormGroup;
  currentUserIsStaff: boolean;
  currentUserPK: number;


  ngOnInit(): void {
    this.changePasswordFormGroup = this.fb.group({
      pk: ['',],
      username: ['', ],
      first_name: ['', ],
      last_name: ['', ],
      email: ['', ],
      password: ['', Validators.required],
      password2: ['', Validators.required],
    }, {validators: this.passwordMatchValidator});
    const pk = this.route.snapshot.paramMap.get('pk');
    if (pk) {
      this.userService.getUser(parseInt(pk, 10))
        .subscribe((user) => {
          this.changePasswordFormGroup.patchValue(user);
        });
    }
    this.userService.getCurrentUser().subscribe((user) => {
      this.currentUserIsStaff = false;
      this.currentUserIsStaff = user.is_staff;
      this.currentUserPK = 0;
      this.currentUserPK = user.pk;

      console.log(this.currentUserIsStaff === true || parseInt(pk, 10) === this.currentUserPK);
      if (!(this.currentUserIsStaff === true || parseInt(pk, 10) === this.currentUserPK)) {
        this.router.navigateByUrl('/user-profile');
      }
    });

  }

  get password2() {
    return this.changePasswordFormGroup.get('password2');
  }


  onPasswordInput() {
    if (this.changePasswordFormGroup.hasError('passwordMismatch')) {
      this.password2.setErrors([{passwordMismatch: true}]);
    } else {
      this.password2.setErrors(null);
    }
  }

  passwordMatchValidator: ValidatorFn = (formGroup: FormGroup): ValidationErrors | null => {
    if (formGroup.get('password').value === formGroup.get('password2').value) {
      return null;
    } else {
      return {passwordMismatch: true};
    }
  }

  changePassword(): void {
    if (this.changePasswordFormGroup.value.password === this.changePasswordFormGroup.value.password2) {
      this.userService.updateUser(this.changePasswordFormGroup.value)
        .pipe(first())
        .subscribe(
          data => {
            alert('Password changed successfully!!');
            this.router.navigate(['/user-profile']);
          },
          (error) => {
            alert('Ups! Something went wrong. Please try again!');
          });
    }else {
      alert('Passwords do not match');
    }
  }
}


