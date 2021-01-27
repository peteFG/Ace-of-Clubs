import { Component, OnInit } from '@angular/core';
import {Time} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {State, StateService} from '../services/state.service';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-state-list',
  templateUrl: './state-list.component.html',
  styleUrls: ['./state-list.component.scss']
})
export class StateListComponent implements OnInit {

  states: State[];
  displayedColumns = ['description', 'actions'];

  constructor(private http: HttpClient,
              private stateService: StateService,
              public userService: UserService) { }

  ngOnInit(): void {
    this.retrieveStates();
  }


  private retrieveStates(): void {
    this.stateService.getStates()
      .subscribe((states) => {
        this.states = states;
    });
  }

  deleteState(state: State): void {
    this.stateService.deleteState(state)
      .subscribe(() => {
        this.retrieveStates();
        alert('deleted successfully!');
      });

  }
}
