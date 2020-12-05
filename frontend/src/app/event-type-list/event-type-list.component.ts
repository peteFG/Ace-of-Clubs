import { Component, OnInit } from '@angular/core';
import {EventService} from "../services/event.service";
import {Time} from "@angular/common";
import {HttpClient} from "@angular/common/http";

interface EventType {
  pk?: number;
  description: string
}

@Component({
  selector: 'app-event-type-list',
  templateUrl: './event-type-list.component.html',
  styleUrls: ['./event-type-list.component.scss']
})
export class EventTypeListComponent implements OnInit {

  eventTypes: EventType[];
  //displayedColumns = ['ev_type', 'name', 'start_time', 'end_time', 'start_date', 'end_date', 'active', 'group']

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get('/api/eventTypes/')
      .subscribe((eventTypes:EventType[]) => {
        this.eventTypes = eventTypes;
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
