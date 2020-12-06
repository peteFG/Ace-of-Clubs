import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Group {
  pk?: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private http: HttpClient) { }

  createGroup(group: Group): Observable<Group> {

    return this.http.post<Group>('/api/groups/', group);
  }

  retrieveGroups(): Observable<Group[]> {
    return this.http.get<Group[]>('/api/groups/');
  }

  deleteGroup(group: Group): Observable<any> {
    return this.http.delete('/api/groups/' + group.pk + '/');
  }

  getGroup(pk: number): Observable<Group> {
    return this.http.get<Group>('/api/groups/' + pk + '/');
  }

  updateGroup(group: Group): Observable<any> {
    return this.http.patch('/api/groups/' + group.pk + '/', group);
  }

}

