import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Event, EventService} from '../services/event.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Group, GroupService} from '../services/group.service';
import {HttpClient} from '@angular/common/http';
import {User, UserEvent, UserService} from '../services/user.service';
import {State, StateService} from '../services/state.service';
import {map} from "rxjs/operators";

@Component({
  selector: 'app-user-event-form',
  templateUrl: './user-event-form.component.html',
  styleUrls: ['./user-event-form.component.scss']
})
export class UserEventFormComponent implements OnInit {

  userEventFormGroup: FormGroup;
  currentUser: number;
  currentUserName: string;
  currentEvent: number;
  currentEventName: string;
  event;
  eventOptions: Event[];
  stateOptions: State[];

  constructor(private http: HttpClient,
              private route: ActivatedRoute,
              private router: Router,
              public userService: UserService,
              private eventService: EventService,
              private stateService: StateService) {
  }

  ngOnInit(): void {
    this.userService.getCurrentUserId();
    this.userEventFormGroup = new FormGroup({
      pk: new FormControl(null),
      user: new FormControl(this.userService.currentUserPK),
      event: new FormControl(this.userService.clickedEvent),
      state: new FormControl(2)
    });

    this.currentEvent = this.userService.clickedEvent;

    this.eventService.getEvent(this.userService.clickedEvent).subscribe((event)=>{
      this.currentEventName = event.name

    })

    this.eventService.getEvents()
      .subscribe((eventOptions) => {
        this.eventOptions = eventOptions;
      });

    this.eventService.getEvent(this.currentEvent)
        .subscribe((event) => {
          this.event = event;
        });

    this.stateService.getStates()
      .subscribe((stateOptions) => {
        this.stateOptions = stateOptions;
      });

    const pk = this.route.snapshot.paramMap.get('pk');
    if (pk) {
      this.http.get('/api/userEvent/' + pk + '/')
        .subscribe((event) => {
          this.userEventFormGroup.patchValue(event);
        });
    }
  }

  createUserEventEntry(): void {
    const pk = this.userEventFormGroup.value.pk;
    if (pk) {
      this.http.put('/api/userEvent/' + pk + '/', this.userEventFormGroup.value)
        .subscribe(() => {
          alert('updated successfully!');
          this.router.navigateByUrl('/event-list');
        });


    } else {
      this.http.post('/api/userEvent/', this.userEventFormGroup.value)
        .subscribe(() => {
          alert('created successfully!');
          this.router.navigateByUrl('/event-list');
        });

    }
  }

}
