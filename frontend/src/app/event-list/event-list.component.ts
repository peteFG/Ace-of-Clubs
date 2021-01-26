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
  events: Event[];
  //currentUserID: number;
  currentUserID: number;
  clickedEvent: number;
  //isActive: boolean;
  panelOpen = false;
  stateOneName: string;
  stateTwoName: string;
  stateThreeName: string;

  displayedColumns = ['pk', 'name', 'start_date', 'start_time', 'end_date', 'end_time', 'active', 'state_one','state_two','state_three', 'actions'];


  constructor(private http: HttpClient,
              private eventService: EventService,
              private route: ActivatedRoute,
              private router: Router,
              public eventTypeService: EventTypeService,
              public userService: UserService,
              public stateService: StateService) {
  }

  ngOnInit(): void {
    /** placeholder --> should be listed in user-profile*/

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


  deleteEvent(event: Event): void {
    this.eventService.deleteEvent(event).subscribe(() => {
      this.retrieveEvents();
      alert('deleted successfully!');
    });
  }

}
