import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {EventService} from '../services/event.service';
import {ActivatedRoute} from '@angular/router';
import {Group, GroupService} from '../services/group.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-user-event-form',
  templateUrl: './user-event-form.component.html',
  styleUrls: ['./user-event-form.component.scss']
})
export class UserEventFormComponent implements OnInit {

  userEventFormGroup: FormGroup;

  constructor(private http: HttpClient, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.userEventFormGroup = new FormGroup({
      pk: new FormControl(null),
      user: new FormControl(),
      event: new FormControl(),
      state: new FormControl()
    });

    const pk = this.route.snapshot.paramMap.get('pk');
    if(pk) {
      this.http.get('/api/userEvent/' + pk + '/')
        .subscribe((event) => {
          this.userEventFormGroup.patchValue(event);
        });
    }
  }

  createEventEntry(): void {
    const pk = this.userEventFormGroup.value.pk;
    if (pk) {
      this.http.put('/api/userEvent/' + pk + '/', this.userEventFormGroup.value)
        .subscribe(() => {
          alert('updated successfully!');
        });
    } else {
      this.http.post('/api/userEvent/', this.userEventFormGroup.value)
        .subscribe(() => {
          alert('created successfully!');
        });
    }
  }

}
