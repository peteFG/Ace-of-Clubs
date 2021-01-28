import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserService} from '../services/user.service';
import {EventTypeService} from "../services/event-type.service";
import {ActivatedRoute} from "@angular/router";

interface EventType {
  pk?: number;
  description: string;
}

@Component({
  selector: 'app-event-type-list',
  templateUrl: './event-type-list.component.html',
  styleUrls: ['./event-type-list.component.scss']
})
export class EventTypeListComponent implements OnInit {

  eventTypes: EventType[];
  displayedColumns = ['ev_type', 'actions'];

  constructor(private http: HttpClient,
              public userService: UserService,
              private eventTypeService: EventTypeService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.userService.retrieveCurrentUser();
    this.retrieveEventTypes()
  }

  retrieveEventTypes(): void {
    this.http.get('/api/eventTypes/')
      .subscribe((eventTypes: EventType[]) => {
        this.eventTypes = eventTypes;
      });
  }

  deleteEventType(entry: EventType): void {
    if (this.userService.currentUser[0].is_staff) {
      this.eventTypeService.deleteEventTypeEntry(entry)
        .subscribe(() => {
          this.retrieveEventTypes();
          alert('deleted successfully!');
        });
    }
    else {
      alert('You do not have permission to perform this action.');
    }
  }
}
