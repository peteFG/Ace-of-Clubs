import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEventsListComponent } from './new-events-list.component';

describe('NewEventsListComponent', () => {
  let component: NewEventsListComponent;
  let fixture: ComponentFixture<NewEventsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewEventsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewEventsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
