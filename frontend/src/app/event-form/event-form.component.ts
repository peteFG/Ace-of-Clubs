import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {EventService} from '../services/event.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Group, GroupService} from '../services/group.service';
import {EventType, EventTypeService} from '../services/event-type.service';
import {UserService} from '../services/user.service';


@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit {

  eventFormGroup: FormGroup;
  eventTypeOptions: EventType[];
  groupOptions: Group[];
  isStaff: boolean;
  groupOptionsForLeader: Group[];
  currentUserIsStaff: boolean;


  constructor(private eventService: EventService,
              private route: ActivatedRoute,
              public eventTypeService: EventTypeService,
              private router: Router,
              private groupService: GroupService,
              public userService: UserService) {
  }

  ngOnInit(): void {

    const now = new Date();

    const defaultDate = now.getFullYear() + '-' + now.getMonth() + '-' + now.getDate();

    this.eventFormGroup = new FormGroup({
      pk: new FormControl(null),
      ev_type: new FormControl(null, Validators.required),
      name: new FormControl('', Validators.required),
      start_time: new FormControl('00:00', Validators.required),
      end_time: new FormControl('00:00', Validators.required),
      start_date: new FormControl(new Date(), Validators.required),
      end_date: new FormControl(new Date(), Validators.required),
      active: new FormControl(true),
      group: new FormControl([0]),
    });

    this.eventTypeService.retrieveEventTypeOptions().subscribe((eventTypeOptions) => {
      this.eventTypeOptions = eventTypeOptions;
    });
    this.userService.getCurrentUser().subscribe((user) => {
      this.isStaff = false;
      this.isStaff = user.is_staff;

      console.log(this.isStaff);
      if (this.isStaff === true) {
        this.groupService.retrieveGroups().subscribe((groupOptions) => {
          this.groupOptions = groupOptions;
        });
      } else {
        this.userService.getUserGroupsByLeader(this.userService.currentUserPK).subscribe((userGroups) => {
          this.groupOptions = [];
          userGroups.forEach((userGroup) => {
            this.groupService.getGroup(userGroup.group).subscribe((group) => {
              this.groupOptions.push(group);
            });
          });
        });
      }
    });


    const pkFromUrl = this.route.snapshot.paramMap.get('pk');
    if (pkFromUrl) {
      this.eventService.getEvent(parseInt(pkFromUrl, 10))
        .subscribe((event) => {
          this.eventFormGroup.patchValue(event);
        });
    }
  }

  createOrUpdateEvent(): void {
    const pkFromFormGroup = this.eventFormGroup.value.pk;
    if (pkFromFormGroup) {
      this.eventService.updateEvent(this.eventFormGroup.value)
        .subscribe(() => {
          alert('updated successfully!');
          this.router.navigateByUrl('/event-list');
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
