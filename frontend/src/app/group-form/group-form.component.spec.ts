import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupForrmComponent } from './group-form.component';

describe('GroupForrmComponent', () => {
  let component: GroupForrmComponent;
  let fixture: ComponentFixture<GroupForrmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupForrmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupForrmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
