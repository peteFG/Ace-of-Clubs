import { Component, OnInit } from '@angular/core';
import {EventService} from "../services/event.service";
import {Time} from "@angular/common";
import {HttpClient} from "@angular/common/http";

interface Group {
  pk?: number;
  name: string
}

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent implements OnInit {

  groups: Group[];
  //displayedColumns = ['ev_type', 'name', 'start_time', 'end_time', 'start_date', 'end_date', 'active', 'group']

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get('/api/group/')
      .subscribe((groups:Group[]) => {
        this.groups = groups;
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
