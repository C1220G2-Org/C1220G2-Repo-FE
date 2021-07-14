import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFeedbackTechnicalComponent } from './create-feedback-technical.component';

describe('CreateFeedbackTechnicalComponent', () => {
  let component: CreateFeedbackTechnicalComponent;
  let fixture: ComponentFixture<CreateFeedbackTechnicalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateFeedbackTechnicalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFeedbackTechnicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
