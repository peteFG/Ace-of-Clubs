import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEventFormComponent } from './user-event-form.component';

describe('UserEventFormComponent', () => {
  let component: UserEventFormComponent;
  let fixture: ComponentFixture<UserEventFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserEventFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserEventFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
