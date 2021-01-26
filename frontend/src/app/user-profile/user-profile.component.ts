import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User, UserService} from '../services/user.service';
import {Observable} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {EventService} from '../services/event.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {


  vacationFormGroup: FormGroup;
  vacationDateForm: FormGroup;
  pks: number[];
  userProfile: User[];
  isStaff: boolean;
  displayedColumns = ['pictures', 'username', 'email', 'first_name', 'last_name', 'edit', 'changePW', 'delete'];

  constructor(private http: HttpClient,
              public userService: UserService,
              private eventService: EventService,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {

    this.vacationDateForm = new FormGroup({
      vac_start_date: new FormControl(new Date(), Validators.required),
      vac_end_date: new FormControl(new Date(), Validators.required)
    });

    this.retrieveUser();


  }

  openDialog(): void {
    const dialogRef = this.dialog.open(VacationForm, {
      width: '40%',
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

    this.eventService.personalEventsFunction().subscribe((events) => {

      const vacationStart = vac_start_date;
      const vacationEnd = vac_end_date; // TODO: Wenn heutiger Tag ausgewählt, dann muss man es kürzen auf normales Date Format.
      console.log(vac_start_date);
      console.log(vac_end_date);

      events.filter(event => event.start_date.toString() > vacationStart
        && event.end_date.toString() < vacationEnd).forEach((entry) => {
        this.pks.push(entry.pk);


      });


      entriesOfActualUser.subscribe((userEvent) => {
        if (userEvent.length == 0) {

          console.log('if check#1');
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
                alert(entry.toString() + 'has been altered!');

                console.log(this.pks);
              });


            }

            let index = this.pks.indexOf(entry.event);
            if (index > -1) {
              this.pks.splice(index, 1);
            }
            console.log(this.pks);
          });
          this.postForEveryUserEvent();


        }
        alert('Your vacation has been set!');

      });
    });

  }


  /** VERWENDEN WENN BACKEND PROBLEM BESEITIGT */

  /*private retrieveUser(): void {

    this.userService.getCurrentUser().subscribe((user)=>{

      this.userProfile = user;
    });
  }*/

  /** Delete User funktioniert noch nicht mit deactivate. Temporärer fix ->
   * Wenn Kein Admin wird HTML Feld nicht angezeigt.
   */

  deleteUser(user: User): void {
    // if (this.userService.currentUserPK == 1) {
    this.userService.deleteUser(user)
      .subscribe(() => {
        this.retrieveUser();
        alert('deleted successfully!');
      });
  }

}

@Component(
  {
    selector: 'vacation-form',
    templateUrl: 'vacation-form.html'
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
    this.vacationDateForm = new FormGroup({
      vac_start_date: new FormControl(new Date(), Validators.required),
      vac_end_date: new FormControl(new Date(), Validators.required)
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

    this.eventService.personalEventsFunction().subscribe((events) => {

      const vacationStart = vac_start_date;
      const vacationEnd = vac_end_date; // TODO: Wenn heutiger Tag ausgewählt, dann muss man es kürzen auf normales Date Format.
      console.log(vac_start_date);
      console.log(vac_end_date);

      events.filter(event => event.start_date.toString() > vacationStart
        && event.end_date.toString() < vacationEnd).forEach((entry) => {
        this.pks.push(entry.pk);


      });


      entriesOfActualUser.subscribe((userEvent) => {
        if (userEvent.length == 0) {

          console.log('if check#1');
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
                alert(entry.toString() + 'has been altered!');

                console.log(this.pks);
              });


            }

            let index = this.pks.indexOf(entry.event);
            if (index > -1) {
              this.pks.splice(index, 1);
            }
            console.log(this.pks);
          });
          this.postForEveryUserEvent();


        }
        alert('Your vacation has been set!');

      });
    });

  }
}
