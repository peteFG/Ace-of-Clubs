import {Component, OnInit} from '@angular/core';
import {Event, EventService} from '../services/event.service';
import {HttpClient} from '@angular/common/http';
import {EventType, EventTypeService} from '../services/event-type.service';
import {UserService} from '../services/user.service';
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {filter} from "rxjs/operators";
import {StateService} from "../services/state.service";


@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})

export class EventListComponent implements OnInit {


  vacationFormGroup: FormGroup;
  vacationDateForm: FormGroup;
  events: Event[];
  //currentUserID: number;
  clickedEvent: number;
  //isActive: boolean;
  panelOpen = false;
  pks: number[];
  stateOneName: string;
  stateTwoName: string;
  stateThreeName: string;

  displayedColumns = ['pk', 'name', 'start_date', 'start_time', 'end_date', 'end_time', 'active', 'state_one','state_two','state_three', 'actions'];

  constructor(private http: HttpClient, private eventService: EventService,
              public eventTypeService: EventTypeService,
              public userService: UserService,
              public stateService: StateService) {
  }

  ngOnInit(): void {
    /** placeholder --> should be listed in user-profile*/
    this.vacationDateForm = new FormGroup( {
      vac_start_date: new FormControl(new Date(), Validators.required),
      vac_end_date: new FormControl(new Date(), Validators.required)
    });

    this.retrieveEvents();
    this.retrieveStates();
  }


  private retrieveEvents(): void {
    this.eventService.personalEventsFunction().subscribe((events) => {
      this.events = events;
    });
  }

  private retrieveStates(): void {
    this.stateService.getStates().subscribe((states)=>{
      this.stateOneName = states[0].description
      this.stateTwoName = states[1].description
      this.stateThreeName = states[2].description
    })
  }


  private postForEveryUserEvent(): void {
    this.pks.forEach((key) => {
      this.vacationFormGroup = new FormGroup({
        pk: new FormControl(),
        user: new FormControl(this.userService.currentUserPK),
        event: new FormControl(key),
        state: new FormControl(3)
      });
      this.http.post('api/userEvent/', this.vacationFormGroup.value).subscribe(() => {
      });
    });
}

  createVacationForUserEvents(vac_start_date, vac_end_date): void {
    const entriesOfActualUser = this.userService.getUserEventsOfCurrentUser();
    this.pks = [];

    this.eventService.personalEventsFunction().subscribe((events) => {

      const vacationStart = vac_start_date;
      const vacationEnd = vac_end_date; // TODO: Wenn heutiger Tag ausgewählt, dann muss man es kürzen auf normales Date Format.
      console.log(vac_start_date);
      console.log(vac_end_date);

      events.filter(event => event.start_date.toString() > vacationStart
        && event.end_date.toString() < vacationEnd).forEach((entry) => {
        this.pks.push(entry.pk);


      });


    entriesOfActualUser.subscribe((userEvent) => {
      if (userEvent.length == 0) {

        console.log('if check#1');
        this.postForEveryUserEvent();


      } else {
        userEvent.forEach((entry) => {

          if (this.pks.includes(entry.event) && entry.state!=3) {

            this.vacationFormGroup = new FormGroup({
              pk: new FormControl(entry.pk),
              user: new FormControl(entry.user),
              event: new FormControl(entry.event),
              state: new FormControl(3)
            });

            this.http.put('api/userEvent/' + entry.pk + '/', this.vacationFormGroup.value).subscribe(() => {
              alert(entry.toString() + 'has been altered!');

              console.log(this.pks);
            });


          }

          let index = this.pks.indexOf(entry.event);
          if (index > -1) {
            this.pks.splice(index, 1);
          }
          console.log(this.pks);
        });
        this.postForEveryUserEvent();


      }
      alert('Your vacation has been set!');

    });
  });

  }


  deleteEvent(event: Event): void {
    this.eventService.deleteEvent(event).subscribe(() => {
      this.retrieveEvents();
      alert('deleted successfully!');
    });
  }

}
