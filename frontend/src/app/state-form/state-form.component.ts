import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {EventService} from '../services/event.service';
import {ActivatedRoute} from '@angular/router';
import {Group, GroupService} from '../services/group.service';
import {HttpClient} from '@angular/common/http';
import {StateService} from '../services/state.service';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-state-form',
  templateUrl: './state-form.component.html',
  styleUrls: ['./state-form.component.scss']
})
export class StateFormComponent implements OnInit {

  stateFormGroup: FormGroup;

  constructor(private stateService: StateService,
              private route: ActivatedRoute,
              public userService: UserService) {
  }

  ngOnInit(): void {
    this.stateFormGroup = new FormGroup({
      pk: new FormControl(null),
      description: new FormControl()
    });

    const pkFromUrl = this.route.snapshot.paramMap.get('pk');
    if (pkFromUrl) {
      this.stateService.getState(parseInt(pkFromUrl, 10))
        .subscribe((state) => {
          this.stateFormGroup.patchValue(state);
        });
    }
  }


  createOrUpdateState(): void {
    const pkFromFormGroup = this.stateFormGroup.value.pk;
    if (pkFromFormGroup) {
      this.stateService.updateState(this.stateFormGroup.value)
        .subscribe(() => {
          alert('updated successfully!');
        });
    } else {
      this.stateService.createState(this.stateFormGroup.value)
        .subscribe(() => {
          alert('created successfully!');
        });
    }
  }

}
