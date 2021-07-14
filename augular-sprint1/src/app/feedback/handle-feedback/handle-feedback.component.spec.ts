import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HandleFeedbackComponent } from './handle-feedback.component';

describe('HandleFeedbackComponent', () => {
  let component: HandleFeedbackComponent;
  let fixture: ComponentFixture<HandleFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HandleFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HandleFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
