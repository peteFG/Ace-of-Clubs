import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {UserService} from "./user.service";
import {map} from "rxjs/operators";
import {flatMap} from "rxjs/internal/operators";

export interface Group {
  pk?: number;
  name: string;
  leader: string;
}

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  existingGroupsPK: number[];

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

  getGroupPKs():void{
    this.existingGroupsPK =[];
    this.retrieveGroups().subscribe((groups)=>{
      groups.forEach((group)=>{
        this.existingGroupsPK.push(group.pk)
      });
    });
  }

}

