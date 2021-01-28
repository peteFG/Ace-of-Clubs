import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable} from 'rxjs';

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
  state_one: string[];
  state_two: string[];
  state_three: string[];
  count_state_one: number;
  count_state_two: number;
  count_state_three: number;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) {
  }

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>('/api/events/');
  }

  deleteEvent(event: Event): Observable<any> {
    return this.http.delete('/api/allEvents/' + event.pk + '/');
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

  filterSortSearchEventCustom(search?: string, group?: string, evtype?: string, sdate?: string, edate?: string): Observable<Event[]> {
    return this.http.get<Event[]>('/api/events/?search=' + search + '&group=' + group + '&evtype=' + evtype + '&sdate=' + sdate + '&edate=' + edate);
  }

  filterSortSearchAllEventCustom(search?: string, group?: string, evtype?: string, sdate?: string, edate?: string, sort?: string): Observable<Event[]> {
    return this.http.get<Event[]>('/api/allEvents/?search=' + search + '&group=' + group + '&evtype=' + evtype + '&sdate=' + sdate + '&edate=' + edate + '&sort=' + sort);
  }

  //-------------------- Section  for Unresponded Event ----------------------

  getNewEvents(): Observable<Event[]> {
    return this.http.get<Event[]>('/api/newEvents/');
  }

  filterSortSearchNewEventCustom(search?: string, group?: string, evtype?: string, sdate?: string, edate?: string): Observable<Event[]> {
    return this.http.get<Event[]>('/api/newEvents/?search=' + search + '&group=' + group + '&evtype=' + evtype + '&sdate=' + sdate + '&edate=' + edate);
  }

  //-------------------- Section  for ADMIN ----------------------

  getAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>('/api/allEvents/');
  }

  /*

  RIP - My lovely function - 27.01.2021

  sortEventCustom(sort: string): Observable<Event[]> {
    return this.http.get<Event[]>('/api/events/?sort=' + sort);
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
  */

}
