import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {EventService} from '../services/event.service';
import {ActivatedRoute} from '@angular/router';
import {Group, GroupService} from '../services/group.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-state-form',
  templateUrl: './state-form.component.html',
  styleUrls: ['./state-form.component.scss']
})
export class StateFormComponent implements OnInit {

  stateFormGroup: FormGroup;

  constructor(private http: HttpClient, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.stateFormGroup = new FormGroup({
      pk: new FormControl(null),
      description: new FormControl()
    });

    const pk = this.route.snapshot.paramMap.get('pk');
    if(pk) {
      this.http.get('/api/states/' + pk + '/')
        .subscribe((group) => {
          this.stateFormGroup.patchValue(group);
        });
    }
  }

  createState(): void {
    const pk = this.stateFormGroup.value.pk;
    if (pk) {
      this.http.put('/api/states/' + pk + '/', this.stateFormGroup.value)
        .subscribe(() => {
          alert('updated successfully!');
        });
    } else {
      this.http.post('/api/states/', this.stateFormGroup.value)
        .subscribe(() => {
          alert('created successfully!');
        });
    }
  }

}
