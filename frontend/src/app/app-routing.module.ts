import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EventListComponent} from "./event-list/event-list.component";
import {HomeComponent} from "./home/home.component";
import {EventFormComponent} from "./event-form/event-form.component";
import {UserListComponent} from "./user-list/user-list.component";
import {UserFormComponent} from "./user-form/user-form.component";

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'user-list', component: UserListComponent},
  {path: 'user-form', component: UserFormComponent},
  {path: 'user-form/:pk', component: UserFormComponent},
  {path: 'event-list', component: EventListComponent},
  {path: 'event-form', component: EventFormComponent},
  {path: 'event-form/:pk', component: EventFormComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
