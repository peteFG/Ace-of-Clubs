import { Injectable } from '@angular/core';
import {Time} from "@angular/common";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

export interface Event {
  pk?: number;
  ev_type: string;
  name: string;
  start_time: Time;
  end_time: Time;
  start_date: Date;
  end_date: Date;
  active: boolean;
  group: number[];
}

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) { }

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>('/api/events/');
  }

  deleteEvent(event: Event): Observable<any> {
    return this.http.delete('/api/events/' + event.pk + '/');
  }

  getEvent(pk: number): Observable<Event> {
    return this.http.get<Event>('/api/events/' + pk + '/');
  }

  updateEvent(event: Event): Observable<any> {
    return this.http.patch('/api/events/' + event.pk + '/', event);
  }

  createMovie(event: Event): Observable<Event> {
    return this.http.post<Event>('/api/events/', event);
  }
}
