import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
// import {Group, GroupService} from '../services/group.service';
import {HttpClient} from '@angular/common/http';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  userFormGroup: FormGroup;

  constructor(private userService: UserService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.userFormGroup = new FormGroup({
      pk: new FormControl(null),
      username: new FormControl(''),
      first_name: new FormControl(''),
      last_name: new FormControl(''),
      email: new FormControl(''),
      is_active: new FormControl(true),
      is_staff: new FormControl(false),
      pictures: new FormControl([]),
    });

    const pk = this.route.snapshot.paramMap.get('pk');
    if (pk) {
      this.userService.getUser(parseInt(pk, 10))
        .subscribe((user) => {
          this.userFormGroup.patchValue(user);
        });
    }
  }

  createOrUpdateUser(): void {
    const pk = this.userFormGroup.value.pk;
    if (pk) {
      this.userService.updateUser(this.userFormGroup.value)
        .subscribe(() => {
          alert('updated successfully!');
        });
    } else {
      this.userService.createUser(this.userFormGroup.value)
        .subscribe(() => {
          alert('created successfully!');
        });
    }
  }

}
