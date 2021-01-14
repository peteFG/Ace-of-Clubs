import {Component, OnInit} from '@angular/core';
import {Event, EventService} from "../services/event.service";
import {HttpClient} from "@angular/common/http";
import {EventType, EventTypeService} from "../services/event-type.service";
import {UserService} from "../services/user.service";
import {UserGroupService} from "../services/user-group.service";

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})

export class EventListComponent implements OnInit {

  events: Event[];
  ev_types: EventType[];

  displayedColumns = ['name', 'start_date', 'start_time', 'end_date', 'end_time', 'active', 'angenommene_user','actions']

  constructor(private http: HttpClient, private eventService: EventService,
              private  userGroupService: UserGroupService,
              public eventTypeService: EventTypeService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.retrieveEvents();
  }

 /* private retrieveEvents(): void {
    this.eventService.getEvents()
      .subscribe((events) => {
        this.events = events;
      });
  }*/
  private retrieveEvents(): void {
    this.events= this.eventService.personalEvents;
  }

  deleteEvent(event: Event): void {
    this.eventService.deleteEvent(event).subscribe(() => {
      this.retrieveEvents();
      alert('deleted successfully!')
    });
  }
}
