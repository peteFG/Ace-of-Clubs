import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EventListComponent } from './event-list/event-list.component';
import { HttpClientModule } from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DateComponent } from './date/date.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { EventFormComponent } from './event-form/event-form.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserFormComponent } from './user-form/user-form.component';
import { GroupListComponent } from './group-list/group-list.component';
import { GroupFormComponent } from './group-form/group-form.component';
import { StateListComponent } from './state-list/state-list.component';
import { StateFormComponent } from './state-form/state-form.component';
import { EventTypeListComponent } from './event-type-list/event-type-list.component';
import { EventTypeFormComponent } from './event-type-form/event-type-form.component';
import { UserEventListComponent } from './user-event-list/user-event-list.component';
import { UserEventFormComponent } from './user-event-form/user-event-form.component';
import { UserGroupListComponent } from './user-group-list/user-group-list.component';
import { UserGroupFormComponent } from './user-group-form/user-group-form.component';
import { MatInputModule } from '@angular/material/input';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { JwtModule } from '@auth0/angular-jwt';
import {DeleteConfirmation, UserProfileComponent, VacationForm} from './user-profile/user-profile.component';
import { RegisterComponent } from './register/register.component';
import { MatDividerModule } from '@angular/material/divider';
import { OverviewComponent } from './overview/overview.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule} from '@angular/material/icon';
import { MediainputComponent } from './mediainput/mediainput.component';
import { FileUploadModule } from 'ng2-file-upload';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { AllEventsListComponent } from './all-events-list/all-events-list.component';
// @ts-ignore
import {MatTableExporterModule } from 'mat-table-exporter';
import {MatSortModule} from '@angular/material/sort';
import { NewEventsListComponent } from './new-events-list/new-events-list.component';

@NgModule({
  declarations: [
    AppComponent,
    EventListComponent,
    DateComponent,
    HomeComponent,
    EventFormComponent,
    UserListComponent,
    UserFormComponent,
    GroupListComponent,
    GroupFormComponent,
    StateListComponent,
    StateFormComponent,
    EventTypeListComponent,
    EventTypeFormComponent,
    UserEventListComponent,
    UserEventFormComponent,
    UserGroupListComponent,
    UserGroupFormComponent,
    LoginComponent,
    LogoutComponent,
    UserProfileComponent,
    RegisterComponent,
    UserProfileComponent,
    ChangePasswordComponent,
    OverviewComponent,
    MediainputComponent,
    VacationForm,
    DeleteConfirmation,
    AllEventsListComponent,
    NewEventsListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatTableExporterModule,
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatDividerModule,
    MatExpansionModule,
    MatIconModule,
    MatSidenavModule,
    MatButtonToggleModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('access_token');
        },
        allowedDomains: ['localhost:4200']
      }
    }),
    FileUploadModule,
    MatTooltipModule,
    MatDialogModule,
    FormsModule,
    MatSortModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
