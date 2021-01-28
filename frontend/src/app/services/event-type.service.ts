import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';


export interface EventType {
  pk?: number;
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

  getEventType(pk: number): Observable<EventType> {
    return this.http.get<EventType>('/api/eventTypes/' + pk + '/');
  }

  deleteEventTypeEntry(eventType: EventType): Observable<any> {
    return this.http.delete('/api/eventTypes/' + eventType.pk + '/');
  }

}
