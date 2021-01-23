import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {forkJoin, Observable} from 'rxjs';
import {UserService} from './user.service';
import {flatMap} from 'rxjs/internal/operators';
import {map} from 'rxjs/operators';

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
  group_names: string[];
  event_type_name: string;

  // not from API
  // personalEntry?: number;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {

  personalEvents: Event[];

  constructor(private http: HttpClient,
              private userService: UserService) {
  }

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
    return this.http.get<Event[]>('api/events/?group=' + groupID);
  }

  personalEventsFunction(): Observable<Event[]> {

    let personalEventsPK = [];


    return this.userService.getUserGroupsByUserID().pipe(flatMap((userGroups) => {

      const observables = [] as Observable<Event[]>[];

      userGroups.forEach((group) => {

        observables.push(this.filtEvents(group.group));
      });

      return forkJoin(observables).pipe(map((results) => {

        const personalEvents = [] as Event[];

        results.forEach((persEv) => {

          persEv.forEach((event) => {

            if (!personalEventsPK.includes(event.pk)) {
              personalEvents.push(event);
            }
            personalEventsPK.push(event.pk);
          });

        });

        return personalEvents;


      }));

    }));

  }

}

