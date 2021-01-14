import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EventListComponent} from "./event-list/event-list.component";
import {HomeComponent} from "./home/home.component";
import {EventFormComponent} from "./event-form/event-form.component";
import {UserListComponent} from "./user-list/user-list.component";
import {UserFormComponent} from "./user-form/user-form.component";
import {GroupFormComponent} from "./group-form/group-form.component";
import {GroupListComponent} from "./group-list/group-list.component";
import {StateListComponent} from "./state-list/state-list.component";
import {StateFormComponent} from "./state-form/state-form.component";
import {EventTypeListComponent} from "./event-type-list/event-type-list.component";
import {EventTypeFormComponent} from "./event-type-form/event-type-form.component";
import {UserEventListComponent} from "./user-event-list/user-event-list.component";
import {UserEventFormComponent} from "./user-event-form/user-event-form.component";
import {UserGroupListComponent} from "./user-group-list/user-group-list.component";
import {UserGroupFormComponent} from "./user-group-form/user-group-form.component";
import {LoginComponent} from "./login/login.component";
import {AuthGuard} from "./guards/auth.guard";
import {UserProfileComponent} from "./user-profile/user-profile.component";

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent},
  {path: 'user-list', component: UserListComponent, canActivate: [AuthGuard]},
  {path: 'user-form', component: UserFormComponent, canActivate: [AuthGuard]},
  {path: 'user-form/:pk', component: UserFormComponent, canActivate: [AuthGuard]},
  {path: 'event-list', component: EventListComponent, canActivate: [AuthGuard]},
  {path: 'event-form', component: EventFormComponent, canActivate: [AuthGuard]},
  {path: 'event-form/:pk', component: EventFormComponent, canActivate: [AuthGuard]},
  {path: 'group-list', component: GroupListComponent, canActivate: [AuthGuard]},
  {path: 'group-form', component: GroupFormComponent, canActivate: [AuthGuard]},
  {path: 'group-form/:pk', component: GroupFormComponent, canActivate: [AuthGuard]},
  {path: 'state-list', component: StateListComponent, canActivate: [AuthGuard]},
  {path: 'state-form', component: StateFormComponent, canActivate: [AuthGuard]},
  {path: 'state-form/:pk', component: StateFormComponent, canActivate: [AuthGuard]},
  {path: 'event-type-list', component: EventTypeListComponent, canActivate: [AuthGuard]},
  {path: 'event-type-form', component: EventTypeFormComponent, canActivate: [AuthGuard]},
  {path: 'event-type-form/:pk', component: EventTypeFormComponent, canActivate: [AuthGuard]},
  {path: 'user-event-list', component: UserEventListComponent, canActivate: [AuthGuard]},
  {path: 'user-event-form', component: UserEventFormComponent, canActivate: [AuthGuard]},
  {path: 'user-event-form/:pk', component: UserEventFormComponent, canActivate: [AuthGuard]},
  {path: 'user-group-list', component: UserGroupListComponent, canActivate: [AuthGuard]},
  {path: 'user-group-form', component: UserGroupFormComponent, canActivate: [AuthGuard]},
  {path: 'user-group-form/:pk', component: UserGroupFormComponent, canActivate: [AuthGuard]},
  {path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
