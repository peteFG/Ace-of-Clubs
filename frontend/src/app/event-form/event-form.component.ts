import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {EventService} from '../services/event.service';
import {ActivatedRoute} from '@angular/router';
import {Group, GroupService} from '../services/group.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit {

  eventFormGroup: FormGroup;

  constructor(private http: HttpClient, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.eventFormGroup = new FormGroup({
      pk: new FormControl(null),
      ev_type: new FormControl(),
      name: new FormControl(''),
      start_time: new FormControl(new Date().getTime()),
      end_time: new FormControl(new Date().getTime()),
      start_date: new FormControl(new Date()),
      end_date: new FormControl(new Date()),
      active: new FormControl(true),
      group: new FormControl([]),
    });

    const pk = this.route.snapshot.paramMap.get('pk');
    if(pk) {
      this.http.get('/api/events/' + pk + '/')
        .subscribe((event) => {
          this.eventFormGroup.patchValue(event);
        });
    }
  }

  createEvent(): void {
    const pk = this.eventFormGroup.value.pk;
    if (pk) {
      this.http.put('/api/events/' + pk + '/', this.eventFormGroup.value)
        .subscribe(() => {
          alert('updated successfully!');
        });
    } else {
      this.http.post('/api/events/', this.eventFormGroup.value)
        .subscribe(() => {
          alert('created successfully!');
        });
    }
  }

}
