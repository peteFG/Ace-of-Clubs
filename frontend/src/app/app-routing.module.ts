import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EventListComponent} from "./event-list/event-list.component";
import {HomeComponent} from "./home/home.component";

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'event-list', component: EventListComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
