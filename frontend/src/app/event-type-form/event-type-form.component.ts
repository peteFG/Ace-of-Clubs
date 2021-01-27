import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-event-type-form',
  templateUrl: './event-type-form.component.html',
  styleUrls: ['./event-type-form.component.scss']
})
export class EventTypeFormComponent implements OnInit {

  eventTypeFormGroup: FormGroup;

  constructor(private http: HttpClient,
              private route: ActivatedRoute,
              private router: Router,
              public userService: UserService) {
  }

  ngOnInit(): void {
    this.eventTypeFormGroup = new FormGroup({
      pk: new FormControl(null),
      description: new FormControl()
    });

    const pk = this.route.snapshot.paramMap.get('pk');
    if (pk) {
      this.http.get('/api/eventTypes/' + pk + '/')
        .subscribe((eventType) => {
          this.eventTypeFormGroup.patchValue(eventType);
        });
    }
  }

  createEventType(): void {
    const pk = this.eventTypeFormGroup.value.pk;
    if (pk) {
      this.http.put('/api/eventTypes/' + pk + '/', this.eventTypeFormGroup.value)
        .subscribe(() => {
          alert('updated successfully!');
          this.router.navigateByUrl('event-type-list');
        });
    } else {
      this.http.post('/api/eventTypes/', this.eventTypeFormGroup.value)
        .subscribe(() => {
          alert('created successfully!');
          this.router.navigateByUrl('event-type-list');
        });
    }
  }

}
