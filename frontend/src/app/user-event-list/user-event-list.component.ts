import {Component, OnInit} from '@angular/core';
import {EventService} from "../services/event.service";
import {Time} from "@angular/common";
import {HttpClient} from "@angular/common/http";
import {UserEvent, UserService} from "../services/user.service";


@Component({
  selector: 'app-user-event-list',
  templateUrl: './user-event-list.component.html',
  styleUrls: ['./user-event-list.component.scss']
})
export class UserEventListComponent implements OnInit {

  userEvents: UserEvent[];
  allUserEvents: UserEvent[];

  //displayedColumns = ['ev_type', 'name', 'start_time', 'end_time', 'start_date', 'end_date', 'active', 'group']

  constructor(private http: HttpClient, public userService: UserService) {
  }

  ngOnInit(): void {

    //this.retrieveUserEvents();
    this.retrieveAllUserEvents();
  }

  retrieveUserEvents():void{
    this.userService.getUserEventsOfCurrentUser().subscribe((userEvents)=>{
      this.userEvents = userEvents;
    })
  }

  retrieveAllUserEvents():void{
    this.userService.getAllUserEvents().subscribe((userEvents)=>{
      this.allUserEvents = userEvents;
  });
  }


  deleteUserEvent(uEvent: UserEvent):void{
    this.userService.deleteUserEventEntry(uEvent).subscribe(()=>{
      this.retrieveAllUserEvents();
    })
  }
}
