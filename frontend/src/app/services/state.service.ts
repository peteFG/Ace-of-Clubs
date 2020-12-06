import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface State {
  pk?: number;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class StateService {

  constructor(private http: HttpClient) { }

  getStates(): Observable<State[]> {
    return this.http.get<State[]>('/api/states/');
  }

  deleteState(state: State): Observable<any> {
    return this.http.delete('/api/states/' + state.pk + '/');
  }

  getState(pk: number): Observable<State> {
    return this.http.get<State>('/api/states/' + pk + '/');
  }

  updateState(state: State): Observable<any> {
    return this.http.patch('/api/states/' + state.pk + '/', state);
  }

  createState(state: State): Observable<any> {
    return this.http.post('/api/states/', state);
  }
}
