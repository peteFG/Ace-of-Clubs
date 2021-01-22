import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {GroupService} from '../services/group.service';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-group-form',
  templateUrl: './group-form.component.html',
  styleUrls: ['./group-form.component.scss']
})
export class GroupFormComponent implements OnInit {

  groupFormGroup: FormGroup;


  constructor(private groupService: GroupService,
              private route: ActivatedRoute,
              public userService: UserService) {
  }

  ngOnInit(): void {
    this.groupFormGroup = new FormGroup({
      pk: new FormControl(null),
      name: new FormControl(),
    });

    const pk = this.route.snapshot.paramMap.get('pk');
    if (pk) {
      // tslint:disable-next-line:radix
      this.groupService.getGroup(parseInt(pk))
        .subscribe((group) => {
          this.groupFormGroup.patchValue(group);
        });
    }
  }


  createGroup(): void {
    const pk = this.groupFormGroup.value.pk;
    if (pk) {
      this.groupService.updateGroup(this.groupFormGroup.value)
        .subscribe(() => {
          alert('updated successfully!');
        });
    } else {
      this.groupService.createGroup(this.groupFormGroup.value)
        .subscribe(() => {
          alert('created successfully!');
        });
    }
  }
}
