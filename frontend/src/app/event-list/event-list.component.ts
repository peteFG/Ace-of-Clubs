import {Component, OnInit} from '@angular/core';
import {Event, EventService} from "../services/event.service";
import {HttpClient} from "@angular/common/http";
import {EventType, EventTypeService} from "../services/event-type.service";
import {UserService} from "../services/user.service";
import {UserGroupService} from "../services/user-group.service";
import {Router} from '@angular/router';
import {empty} from "rxjs/internal/Observer";
import {flatMap} from "rxjs/internal/operators";

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})

export class EventListComponent implements OnInit {

  events: Event[];
  currentUserID:number;
  clickedEvent:number;

  displayedColumns = ['pk','name', 'start_date', 'start_time', 'end_date', 'end_time', 'active', 'angenommene_user','actions']

  constructor(private http: HttpClient, private eventService: EventService,
              private  userGroupService: UserGroupService,
              public eventTypeService: EventTypeService,
              public userService: UserService) {
  }

  ngOnInit(): void {
    this.userGroupService.gGBUID().subscribe((groups)=>{
      console.log(groups);
    });
    this.retrieveEvents();

  }


  private retrieveEvents(): void {
    //this.eventService.personalEventsFunction();
    //this.events = this.eventService.personalEventsFunction();
    // Funktion welche existierende UserEvent-Einträge auf die Events legt???
    this.eventService.personalEventsFunction().subscribe((events)=>{
      this.events= events
    })
  }

  deleteEvent(event: Event): void {
    this.eventService.deleteEvent(event).subscribe(() => {
      this.retrieveEvents();
      alert('deleted successfully!')
    });
  }

}
