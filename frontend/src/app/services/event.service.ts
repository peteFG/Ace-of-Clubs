import { Injectable } from '@angular/core';
import {Time} from "@angular/common";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserGroupService} from "./user-group.service";
import {empty} from "rxjs/internal/Observer";
import set = Reflect.set;

export interface Event {
  pk?: number;
  ev_type: string;
  name: string;
  start_time: string;
  end_time: string;
  start_date: Date;
  end_date: Date;
  active: boolean;
  group: number[];
}

@Injectable({
  providedIn: 'root'
})
export class EventService {

  personalEvents:Event[];

  constructor(private http: HttpClient, private userGroupService: UserGroupService) { }

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

  createEvent(event: Event): Observable<Event> {
    return this.http.post<Event>('/api/events/', event);
  }


  // Filter Events nach Gruppen des aktuellen User
  filtEvents(groupID: number): Observable<Event[]> {
    return this.http.get<Event[]>('api/events/?group=' + groupID)
  }

  personalEventsFunction():void {
    var groupIDs = this.userGroupService.groupsPKByUserID;
    this.personalEvents = [];
    var personalEventsPK = [];


    groupIDs.forEach((groupPK) => {

      this.filtEvents(groupPK).subscribe((events) => {
        events.forEach((event) => {

          if (personalEventsPK.includes(event.pk)) {
            alert('Event already in List');

          } else {
            personalEventsPK = personalEventsPK.concat(event.pk); //  Sicherstellung, dass keine Duplikate vorhanden sind
            this.personalEvents = this.personalEvents.concat(event);
          }

        })
      })
    })
  }


}
