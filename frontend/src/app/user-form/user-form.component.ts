import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {EventService} from '../services/event.service';
import {ActivatedRoute} from '@angular/router';
import {Group, GroupService} from '../services/group.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  userFormGroup: FormGroup;

  constructor(private http: HttpClient, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.userFormGroup = new FormGroup({
      pk: new FormControl(null),
      username: new FormControl(0),
      first_name: new FormControl(0),
      last_name: new FormControl(''),
      email: new FormControl(new Date().getTime()),
      is_active: new FormControl(new Date().getTime()),
      is_staff: new FormControl(new Date())
    });

    const pk = this.route.snapshot.paramMap.get('pk');
    if(pk) {
      this.http.get('/api/users/' + pk + '/')
        .subscribe((user) => {
          this.userFormGroup.patchValue(user);
        });
    }
  }

  createUser(): void {
    const pk = this.userFormGroup.value.pk;
    if (pk) {
      this.http.put('/api/users/' + pk + '/', this.userFormGroup.value)
        .subscribe(() => {
          alert('updated successfully!');
        });
    } else {
      this.http.post('/api/users/', this.userFormGroup.value)
        .subscribe(() => {
          alert('created successfully!');
        });
    }
  }

}
