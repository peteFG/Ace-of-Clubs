import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {EventService} from '../services/event.service';
import {ActivatedRoute} from '@angular/router';
import {Group, GroupService} from '../services/group.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-user-group-form',
  templateUrl: './user-group-form.component.html',
  styleUrls: ['./user-group-form.component.scss']
})
export class UserGroupFormComponent implements OnInit {

  userGroupFormGroup: FormGroup;

  constructor(private http: HttpClient, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.userGroupFormGroup = new FormGroup({
      pk: new FormControl(null),
      user: new FormControl(),
      group: new FormControl(),
      is_leader: new FormControl(false)
    });

    const pk = this.route.snapshot.paramMap.get('pk');
    if(pk) {
      this.http.get('/api/userGroup/' + pk + '/')
        .subscribe((userGroup) => {
          this.userGroupFormGroup.patchValue(userGroup);
        });
    }
  }

  createGroupEntry(): void {
    const pk = this.userGroupFormGroup.value.pk;
    if (pk) {
      this.http.put('/api/userGroup/' + pk + '/', this.userGroupFormGroup.value)
        .subscribe(() => {
          alert('updated successfully!');
        });
    } else {
      this.http.post('/api/userGroup/', this.userGroupFormGroup.value)
        .subscribe(() => {
          alert('created successfully!');
        });
    }
  }

}
