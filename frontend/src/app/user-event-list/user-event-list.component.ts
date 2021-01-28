import {Component, OnInit} from '@angular/core';
import {EventService} from "../services/event.service";
import {Time} from "@angular/common";
import {HttpClient} from '@angular/common/http';
import {UserEvent, UserService} from "../services/user.service";
import {ActivatedRoute} from "@angular/router";


@Component({
  selector: 'app-user-event-list',
  templateUrl: './user-event-list.component.html',
  styleUrls: ['./user-event-list.component.scss']
})
export class UserEventListComponent implements OnInit {

  allUserEvents: UserEvent[];
  displayedColumns = ['user', 'event', 'state', 'delete']

  constructor(private http: HttpClient,
              private route: ActivatedRoute,
              public userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.retrieveCurrentUser();

    const pkFromUrl = this.route.snapshot.paramMap.get('pk');
    if(pkFromUrl) {
      this.retrieveUserEventsFromClickedUser(pkFromUrl);
    }
    else {
      /** Überprüfung ob ADMIN!!! */
      this.retrieveAllUserEvents();

    }

  }


  retrieveAllUserEvents():void{
    this.userService.getAllUserEvents().subscribe((userEvents)=>{
      this.allUserEvents = userEvents;
  });
  }

  retrieveUserEventsFromClickedUser(pk:string): void {
    this.userService.getUserEventsByUserID(parseInt(pk,10))
      .subscribe((userEvents) => {
        this.allUserEvents = userEvents;
      });

  }

  deleteUserEventEntry(entry: UserEvent): void {
    this.userService.deleteUserEventEntry(entry).subscribe(()=>{
      const pkFromUrl = this.route.snapshot.paramMap.get('pk');
      if(pkFromUrl) {
        this.userService.getUserEventsByUserID(parseInt(pkFromUrl,10))
          .subscribe((userEvents) => {
            this.allUserEvents = userEvents;
          });
      }else {
        this.retrieveAllUserEvents();
        alert('deleted successfully!');
      }
    });
  }
}
