import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Event, EventService} from '../services/event.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Group, GroupService} from '../services/group.service';
import {HttpClient} from '@angular/common/http';
import {User, UserEvent, UserService} from '../services/user.service';
import {State, StateService} from '../services/state.service';
import {map} from 'rxjs/operators';
import {EventTypeService} from '../services/event-type.service';

@Component({
    selector: 'app-user-event-form',
    templateUrl: './user-event-form.component.html',
    styleUrls: ['./user-event-form.component.scss']
})
export class UserEventFormComponent implements OnInit {

    userEventFormGroup: FormGroup;
    currentUser: number;
    currentUserName: string;

    currentEvent: number;
    currentEventName: string;
    currentEventSD: any;
    currentEventST: any;
    currentEventGroup: string[];
    currentEventED: any;
    currentEventET: any;
    currentEventType: any;
    activeEvent: boolean;

    eventType: any;
    event;
    eventOptions: Event[];
    stateOptions: State[];

    constructor(private http: HttpClient,
                private route: ActivatedRoute,
                private router: Router,
                public userService: UserService,
                private eventService: EventService,
                private stateService: StateService,
                private eventTypeService: EventTypeService,
                private groupService: GroupService) {
    }

    ngOnInit(): void {
        this.userService.getCurrentUserId();
        this.userEventFormGroup = new FormGroup({
            pk: new FormControl(null),
            user: new FormControl(this.userService.currentUserPK),
            event: new FormControl(this.userService.clickedEvent),
            state: new FormControl(2)
        });

        //console.log(this.userService.currentUserPK);

        this.currentEvent = this.userService.clickedEvent;

        this.eventService.getEvent(this.userService.clickedEvent)
            .subscribe((event) => {
                this.currentEventName = event.name;
                this.currentEventSD = event.start_date;
                this.currentEventST = event.start_time;
                this.currentEventED = event.end_date;
                this.currentEventET = event.end_time;
                this.currentEventGroup = event.group_names;
                this.currentEventType = event.event_type_name;
                this.activeEvent = event.active;
            });

        this.eventTypeService.getEventType(this.currentEventType)
            .subscribe((eventType) => {
                this.eventType = eventType;
            });

        this.eventService.getEvents()
            .subscribe((eventOptions) => {
                this.eventOptions = eventOptions;
            });

        this.eventService.getEvent(this.currentEvent)
            .subscribe((event) => {
                this.event = event;
            });

        this.stateService.getStates()
            .subscribe((stateOptions) => {
                this.stateOptions = stateOptions;
            });

        const pk = this.route.snapshot.paramMap.get('pk');
        if (pk) {
            this.http.get('/api/userEvent/' + pk + '/')
                .subscribe((event) => {
                    this.userEventFormGroup.patchValue(event);
                });
        }
    }

    retrieveEventType(evPk: any): void {
        this.eventTypeService.getEventType(evPk)
            .subscribe((eventType) => {
                this.eventType = eventType;
            });
    }

    createUserEventEntry(): void {
        const pk = this.userEventFormGroup.value.pk;
        if (pk) {
            this.http.put('/api/userEvent/' + pk + '/', this.userEventFormGroup.value)
                .subscribe(() => {
                    alert('updated successfully!');
                    this.router.navigateByUrl('/event-list');
                });


        } else {
            this.http.post('/api/userEvent/', this.userEventFormGroup.value)
                .subscribe(() => {
                    alert('created successfully!');
                    this.router.navigateByUrl('/event-list');
                });

        }
    }

}
