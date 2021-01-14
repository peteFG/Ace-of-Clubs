import {Component, OnInit} from '@angular/core';
import {EventService} from "../services/event.service";
import {Time} from "@angular/common";
import {HttpClient} from "@angular/common/http";
import {UserService} from "../services/user.service";

interface UserEvent {
  pk?: number;
  user: string;
  event: string;
  state: string
}

@Component({
  selector: 'app-user-event-list',
  templateUrl: './user-event-list.component.html',
  styleUrls: ['./user-event-list.component.scss']
})
export class UserEventListComponent implements OnInit {

  userEvents: UserEvent[];

  //displayedColumns = ['ev_type', 'name', 'start_time', 'end_time', 'start_date', 'end_date', 'active', 'group']

  constructor(private http: HttpClient, private userService: UserService) {
  }

  ngOnInit(): void {
    this.http.get('/api/userEvent/')
      .subscribe((userEvents: UserEvent[]) => {
        this.userEvents = userEvents;
      })
    /*
    this.retrieveEvents()
    */
  }

  /*
  private retrieveEvents(): void {
    this.eventService.getEvents()
      .subscribe((events) => {
        this.events = events;
    })
  }

  deleteEvent(event: Event): void {
    this.eventService.deleteEvent(event)
      .subscribe(() => {
        this.retrieveEvents();
        alert('deleted successfully!');
      });
  } */
}
