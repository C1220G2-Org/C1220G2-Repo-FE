import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BookingAgreeComponent} from './booking-agree.component';

describe('BookingAgreeComponent', () => {
  let component: BookingAgreeComponent;
  let fixture: ComponentFixture<BookingAgreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BookingAgreeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingAgreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
