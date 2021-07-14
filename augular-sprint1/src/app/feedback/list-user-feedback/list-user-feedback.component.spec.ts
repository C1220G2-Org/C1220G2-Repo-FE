import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListUserFeedbackComponent } from './list-user-feedback.component';

describe('ListUserFeedbackComponent', () => {
  let component: ListUserFeedbackComponent;
  let fixture: ComponentFixture<ListUserFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListUserFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListUserFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
