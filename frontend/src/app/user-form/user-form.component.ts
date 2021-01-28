import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
// import {Group, GroupService} from '../services/group.service';
import {HttpClient} from '@angular/common/http';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  @Input()
  hasProfilePic = false;
  userFormGroup: FormGroup;
  currentUser: number;
  currentUserIsStaff: boolean;
  currentUserPK: number;

  constructor(public userService: UserService,
              private route: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder) {

  }

  ngOnInit(): void {
    this.userFormGroup = this.fb.group({
      pk: new FormControl(null),
      username: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', Validators.required],
      pictures: new FormControl([]),
      password: ['', Validators.required],
      password2: [''],
      is_active: new FormControl(false),
      is_staff: new FormControl(false),
      groups: new FormControl([2]),
    });
    this.userService.retrieveCurrentUser();
    const pk = this.route.snapshot.paramMap.get('pk');
    if (pk) {
      this.userService.getUser(parseInt(pk, 10))
        .subscribe((user) => {
          this.userService.clickedUser = parseInt(pk, 10);
          this.userFormGroup.patchValue(user);
        });
    }

    this.userService.getCurrentUser().subscribe((user) => {
      this.currentUserIsStaff = false;
      this.currentUserIsStaff = user.is_staff;
      this.currentUserPK = 0;
      this.currentUserPK = user.pk;

      if (!(this.currentUserIsStaff === true || parseInt(pk, 10) === this.currentUserPK)) {
        this.router.navigateByUrl('/event-list');
      }
    });

  }


  createOrUpdateUser(): void {
    this.userFormGroup.value.password2 = this.userFormGroup.value.password;
    const pk = this.userFormGroup.value.pk;
    if (pk) {
      this.userService.updateUser(this.userFormGroup.value)
        .subscribe(() => {
          alert('updated successfully!');
          if (this.userService.previousSite == '/user-profile') {
            this.router.navigateByUrl('/user-profile');
          }
          else {
            this.router.navigateByUrl('/user-list');
          }
          this.userService.retrieveCurrentUser();
        });
    } else {
      this.userService.createUser(this.userFormGroup.value)
        .subscribe(() => {
          alert('created successfully!');
          this.router.navigateByUrl('/user-list');
        });
    }

  }


}
