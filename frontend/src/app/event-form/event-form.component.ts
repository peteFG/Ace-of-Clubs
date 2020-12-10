import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {EventService} from '../services/event.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Group, GroupService} from '../services/group.service';
import {HttpClient} from '@angular/common/http';
import {EventType, EventTypeService} from "../services/event-type.service";
/*import {User, UserService} from "../services/user.service";*/

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit {

  eventFormGroup: FormGroup;
  eventTypeOptions: EventType[];
  groupOptions: Group[];
  /*personOptions: User[];*/

  constructor(private eventService: EventService,
              private route: ActivatedRoute,
              public eventTypeService: EventTypeService,
              private router: Router,
              private groupService: GroupService/*,
              private userService: UserService*/) {
  }

  ngOnInit(): void {

    const now = new Date()

    const defaultDate = now.getFullYear() + '-' + now.getMonth() + '-' + now.getDate();

    this.eventFormGroup = new FormGroup({
      pk: new FormControl(null),
      ev_type: new FormControl(null),
      name: new FormControl('', Validators.required),
      start_time: new FormControl(new Date().getTime()),
      end_time: new FormControl(new Date().getTime()),
      start_date: new FormControl(defaultDate),
      end_date: new FormControl(defaultDate),
      active: new FormControl(true),
      group: new FormControl([]),
    });

    this.eventTypeService.retrieveEventTypeOptions().subscribe((eventTypeOptions) => {
      this.eventTypeOptions = eventTypeOptions;
    });

    this.groupService.retrieveGroups().subscribe((groupOptions) => {
      this.groupOptions = groupOptions;
    });

    /*this.userService.getUsers()
      .subscribe((personOptions)=>{
        this.personOptions =personOptions
      })*/

    const pkFromUrl = this.route.snapshot.paramMap.get('pk');
    if (pkFromUrl) {
      this.eventService.getEvent(parseInt(pkFromUrl, 10))
        .subscribe((event) => {
          this.eventFormGroup.patchValue(event)
        });
    }
  }

  createOrUpdateEvent(): void {
    const pkFromFormGroup = this.eventFormGroup.value.pk;
    if (pkFromFormGroup) {
      this.eventService.updateEvent(this.eventFormGroup.value)
        .subscribe(() => {
          alert('updated successfully!');
        });
    } else {
      this.eventService.createEvent(this.eventFormGroup.value)
        .subscribe((event) => {
          alert('created successfully!');
          this.router.navigate(['/event-form/' + event.pk]);
        });
    }
  }

}
