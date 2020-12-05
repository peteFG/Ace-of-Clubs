import { Component, OnInit } from '@angular/core';
import {EventService} from "../services/event.service";
import {Time} from "@angular/common";
import {HttpClient} from "@angular/common/http";

interface State {
  pk?: number;
  description: string
}

@Component({
  selector: 'app-state-list',
  templateUrl: './state-list.component.html',
  styleUrls: ['./state-list.component.scss']
})
export class StateListComponent implements OnInit {

  states: State[];
  //displayedColumns = ['ev_type', 'name', 'start_time', 'end_time', 'start_date', 'end_date', 'active', 'group']

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get('/api/states/')
      .subscribe((states:State[]) => {
        this.states = states;
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
