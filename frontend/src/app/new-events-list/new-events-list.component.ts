import {Component, OnInit} from '@angular/core';
import {Event, EventService} from '../services/event.service';
import {HttpClient} from '@angular/common/http';
import {EventType, EventTypeService} from '../services/event-type.service';
import {UserService} from '../services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import {StateService} from '../services/state.service';
import {CdkTableExporterModule} from 'cdk-table-exporter';
import {Group, GroupService} from '../services/group.service';

@Component({
  selector: 'app-new-events-list',
  templateUrl: './new-events-list.component.html',
  styleUrls: ['./new-events-list.component.scss']
})
export class NewEventsListComponent extends CdkTableExporterModule implements OnInit {
  newEvents: Event[];
  panelOpen = false;
  tableView = false;
  pks: number[];
  stateOneName: string;
  stateTwoName: string;
  stateThreeName: string;
  search: null;
  eventFilterFormGroup: FormGroup;
  eventTypeOptions: EventType[];
  groupOptions: Group[];
  str: string;
  showFilter: boolean;
  showSearch: boolean;

  displayedColumns = ['name', 'group_name', 'event_type', 'start_date', 'start_time', 'end_date', 'end_time', 'active', 'state_one', 'state_two', 'state_three', 'actions'];

  constructor(private http: HttpClient,
              private eventService: EventService,
              private groupService: GroupService,
              private route: ActivatedRoute,
              private router: Router,
              public eventTypeService: EventTypeService,
              public userService: UserService,
              public stateService: StateService) {
    super();
  }

  ngOnInit(): void {

    this.showFilter = false;
    this.showSearch = false;

    this.userService.retrieveCurrentUser();

    this.userService.previousSite = this.userService.previousUrl;
    this.retrieveEvents();
    this.retrieveStates();
    this.retrieveGroups();

    this.eventTypeService.retrieveEventTypeOptions().subscribe((eventTypeOptions) => {
      this.eventTypeOptions = eventTypeOptions;
    });

    this.eventFilterFormGroup = new FormGroup({
      group: new FormControl(null),
      ev_type: new FormControl(null),
      start_date: new FormControl(null),
      end_date: new FormControl(null),
    });
  }

  private retrieveGroups(): void {
    this.userService.getCurrentUser().subscribe((user) => {
      this.userService.getUserGroupsByUsersPK(user.pk).subscribe((userGroups) => {
        userGroups.forEach((userGroup) => {
          this.groupOptions = [];
          this.groupService.getGroup(userGroup.group).subscribe((group) => {
            this.groupOptions.push(group);
          });
        });
      });
    });
  }


  private retrieveEvents(): void {
    this.eventService.getNewEvents().subscribe((events) => {
      this.newEvents = events;
    });
  }

  private retrieveStates(): void {
    this.stateService.getStates().subscribe((states) => {
      this.stateOneName = states[0].description;
      this.stateTwoName = states[1].description;
      this.stateThreeName = states[2].description;
    });
  }


  deleteEvent(event: Event): void {
    this.eventService.deleteEvent(event).subscribe(() => {
      this.retrieveEvents();
      alert('deleted successfully!');
    });
  }

  filterSortSearchEvents(search: string, str: string): void {
    if (search === undefined){
      search = null;
    }
    if (str === ''){
      str = null;
    }else if (this.str === str){
      this.str = '-' + str;
    }else {
      this.str = str;
    }
    this.eventService.filterSortSearchNewEventCustom(
      search,
      this.eventFilterFormGroup.value.group,
      this.eventFilterFormGroup.value.ev_type,
      this.eventFilterFormGroup.value.start_date,
      this.eventFilterFormGroup.value.end_date).subscribe((newEvents) => {
      this.newEvents = newEvents;
      this.router.navigateByUrl('/new-events-list');
    });
  }

  showFilterOptions(): void {
    if (this.showFilter === false) {
      this.showFilter = true;
    } else {
      this.showFilter = false;
    }
  }

  showSearchbar(): void {
    if (this.showSearch === false) {
      this.showSearch = true;
    } else {
      this.showSearch = false;
    }
  }

}
