import { Injectable } from '@angular/core';
import {Interface} from "readline";
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface EventType {
  pk: number;
  description: string;
}

@Injectable({
  providedIn: 'root'
})

export class EventTypeService {

  constructor(private http: HttpClient) { }

  retrieveEventTypeOptions(): Observable<EventType[]> {
    return this.http.get<EventType[]>('/api/eventTypes/');
  }
}
