import { Component, OnInit } from '@angular/core';
import {Event, EventService} from "../services/event.service";
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  events: Event[];

  displayedColumns = ['name', 'group_name', 'event_type', 'start_date', 'start_time', 'end_date', 'end_time'];


  constructor(private eventService: EventService,
              ) { }

  ngOnInit(): void {
    this.retrieveEvents()
  }

  private retrieveEvents(): void {
    this.events = [];
    this.eventService.getEvents().subscribe((events) => {
      this.events = events.slice(0,5);
    });
  }

}
