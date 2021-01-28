import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User, UserService} from '../services/user.service';
import {Observable} from 'rxjs';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {EventService} from '../services/event.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  pks: number[];
  userProfile: User[];
  isStaff: boolean;
  backToProfile: string;
  displayedColumns = ['pictures', 'username', 'email', 'first_name', 'last_name', 'edit', 'changePW', 'delete'];

  constructor(private http: HttpClient,
              public userService: UserService,
              private eventService: EventService,
              public dialog: MatDialog,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {

    this.userService.previousSite = this.userService.previousUrl;
    this.retrieveUser();

  }

  openDialog(): void {
    const dialogRef = this.dialog.open(VacationForm, {
      width: 'fit-content',
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  openDeleteDialog(): void {
    const dialogRef = this.dialog.open(DeleteConfirmation, {
      width: 'fit-content',
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  private retrieveUser(): void {

    this.userService.getCurrentUser().subscribe((user) => {
      this.userProfile = [];
      this.userProfile.push(user);
      this.isStaff = user.is_staff;
    });
  }

  /** VERWENDEN WENN BACKEND PROBLEM BESEITIGT */

  /*private retrieveUser(): void {

    this.userService.getCurrentUser().subscribe((user)=>{

      this.userProfile = user;
    });
  }*/

}

@Component(
  {
    selector: 'vacation-form',
    templateUrl: 'vacation-form.html',
    styleUrls: ['./modal.scss']
  }
)

export class VacationForm implements OnInit {

  vacationFormGroup: FormGroup;
  vacationDateForm: FormGroup;
  pks: number[];
  userProfile: User[];
  isStaff: boolean;

  constructor(private http: HttpClient,
              public userService: UserService,
              private eventService: EventService,
  ) {
  }

  ngOnInit(): void {
    this.userService.retrieveCurrentUser();

    this.vacationDateForm = new FormGroup({
      vac_start_date: new FormControl(new Date().getDate(), Validators.required),
      vac_end_date: new FormControl(new Date().getDate(), Validators.required)
    });
  }

  private postForEveryUserEvent(): void {
    this.pks.forEach((key) => {
      this.vacationFormGroup = new FormGroup({
        pk: new FormControl(),
        user: new FormControl(this.userService.currentUserPK),
        event: new FormControl(key),
        state: new FormControl(3)
      });
      this.http.post('api/userEvent/', this.vacationFormGroup.value).subscribe(() => {
      });
    });
  }

  createVacationForUserEvents(vac_start_date, vac_end_date): void {
    const entriesOfActualUser = this.userService.getUserEventsOfCurrentUser();
    this.pks = [];

    this.eventService.getEvents().subscribe((events) => {

      const vacationStart = vac_start_date;
      const vacationEnd = vac_end_date;
      console.log(vac_start_date);
      console.log(vac_end_date);

      events.filter(event => event.start_date.toString() >= vacationStart
        && event.end_date.toString() < vacationEnd).forEach((entry) => {
        this.pks.push(entry.pk);
      });


      entriesOfActualUser.subscribe((userEvent) => {
        if (userEvent.length == 0) {
          this.postForEveryUserEvent();


        } else {
          userEvent.forEach((entry) => {

            if (this.pks.includes(entry.event) && entry.state != 3) {

              this.vacationFormGroup = new FormGroup({
                pk: new FormControl(entry.pk),
                user: new FormControl(entry.user),
                event: new FormControl(entry.event),
                state: new FormControl(3)
              });

              this.http.put('api/userEvent/' + entry.pk + '/', this.vacationFormGroup.value).subscribe(() => {
              });


            }

            const index = this.pks.indexOf(entry.event);
            if (index > -1) {
              this.pks.splice(index, 1);
            }
          });
          this.postForEveryUserEvent();


        }
        alert('Your vacation has been set!');

      });
    });

  }
}

@Component(
  {
    selector: 'delete-confirmation',
    templateUrl: 'delete-confirmation.html',
    styleUrls: ['./modal.scss']
  }
)

export class DeleteConfirmation implements OnInit {

  pks: number[];
  userProfile: User[];
  disableFormGroup: FormGroup;

  constructor(private http: HttpClient,
              public userService: UserService,
              private eventService: EventService,
              private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {

    this.retrieveUser();
  }

  private retrieveUser(): void {

    this.userService.getCurrentUser().subscribe((user) => {
      this.userProfile = [];
      this.userProfile.push(user);
    });
  }

  deleteUser(user: User): void {
    // if (this.userService.currentUserPK == 1) {
    this.userService.deleteUser(user)
      .subscribe(() => {
        this.retrieveUser();
        alert('deleted successfully!');
      });
  }

  disableUser(user: User): void {

    this.disableFormGroup = this.fb.group({
      pk: new FormControl(),
      email: new FormControl(),
      username: new FormControl(),
      first_name: new FormControl(),
      last_name: new FormControl(),
      password: ['', Validators.required],
      groups: new FormControl(),
      is_staff: new FormControl(),
      pictures: new FormControl(),
      is_active: new FormControl()

    });
    this.disableFormGroup.patchValue(user);
    this.disableFormGroup.value.password2 = this.disableFormGroup.value.password;
    this.disableFormGroup.value.is_active = false;
    this.http.put('api/users/' + user.pk + '/', this.disableFormGroup.value).subscribe(() => {
      this.userService.logout();
    });
  }
}
