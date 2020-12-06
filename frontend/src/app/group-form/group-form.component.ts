import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {EventService} from '../services/event.service';
import {ActivatedRoute} from '@angular/router';
import {Group, GroupService} from '../services/group.service';
import {HttpClient} from '@angular/common/http';
import {any} from "codelyzer/util/function";

@Component({
  selector: 'app-group-form',
  templateUrl: './group-form.component.html',
  styleUrls: ['./group-form.component.scss']
})
export class GroupFormComponent implements OnInit {

  groupFormGroup: FormGroup;


  constructor(private http: HttpClient, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.groupFormGroup = new FormGroup({
      pk: new FormControl(null),
      name: new FormControl()
    });

    const pk = this.route.snapshot.paramMap.get('pk');
    if (pk) {
      this.http.get('/api/groups/' + pk + '/')
        .subscribe((group) => {
          this.groupFormGroup.patchValue(group);
        });
    }
  }


  createGroup(): void {
    const pk = this.groupFormGroup.value.pk;
    if (pk) {
      this.http.put('/api/groups/' + pk + '/', this.groupFormGroup.value)
        .subscribe(() => {
          alert('updated successfully!');
        });
    } else {
      this.http.post('/api/groups/', this.groupFormGroup.value)
        .subscribe(() => {
          alert('created successfully!');
        });
    }
  }

  deleteGroup(group: Group): void {
    this.http.delete('/api/groups/' + group.pk + '/')
      .subscribe(() => {
        alert('created successfully!');
      });
  }


}
