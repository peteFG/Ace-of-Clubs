import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Group {
  pk: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private http: HttpClient) { }

  retrieveGroups(): Observable<Group[]> {
    return this.http.get<Group[]>('/api/groups/');
  }
}
