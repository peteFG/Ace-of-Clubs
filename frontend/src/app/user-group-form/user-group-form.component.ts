import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Group, GroupService} from '../services/group.service';
import {HttpClient} from '@angular/common/http';
import {User, UserService} from "../services/user.service";

@Component({
  selector: 'app-user-group-form',
  templateUrl: './user-group-form.component.html',
  styleUrls: ['./user-group-form.component.scss']
})
export class UserGroupFormComponent implements OnInit {

  userGroupFormGroup: FormGroup;
  userOptions:User[];
  groupOptions:Group[];

  constructor(private http: HttpClient,
              private route: ActivatedRoute,
              private router: Router,
              public userService: UserService,
              public groupService: GroupService) {
  }

  ngOnInit(): void {
    this.userGroupFormGroup = new FormGroup({
      pk: new FormControl(null),
      user: new FormControl(this.userService.clickedUser),
      group: new FormControl(),
      is_leader: new FormControl(false)
    });


    this.readAvailableGroups();
    this.userService.getUsers().subscribe((users)=>{
      this.userOptions = users;
    });


    const pk = this.route.snapshot.paramMap.get('pk');
    if(pk) {
      this.http.get('/api/allUserGroups/' + pk + '/')
        .subscribe((userGroup) => {
          this.userGroupFormGroup.patchValue(userGroup);
        });
    }
  }

  createOrUpdateGroupEntry(): void {
    const pk = this.userGroupFormGroup.value.pk;
    if (pk) {
      this.http.put('/api/allUserGroups/' + pk + '/', this.userGroupFormGroup.value)
        .subscribe(() => {
          alert('updated successfully!');
          this.router.navigateByUrl('/user-form/'+ this.userGroupFormGroup.controls['user'].value)
        });
    } else {
      this.http.post('/api/allUserGroups/', this.userGroupFormGroup.value)
        .subscribe(() => {
          alert('created successfully!');
          this.router.navigateByUrl('/user-form/'+ this.userGroupFormGroup.controls['user'].value)
        });
    }
  }

  readAvailableGroups(): void {
    const pks = this.userService.availableGroups;
    this.groupOptions = [];

    this.groupService.retrieveGroups().subscribe((groups)=>{
      groups.forEach((group)=>{
        if(pks.includes(group.pk)){
          this.groupOptions.push(group);
        }
      });
    })
  }
}
