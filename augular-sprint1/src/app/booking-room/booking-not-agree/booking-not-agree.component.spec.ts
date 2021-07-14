import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BookingNotAgreeComponent} from './booking-not-agree.component';

describe('BookingNotAgreeComponent', () => {
  let component: BookingNotAgreeComponent;
  let fixture: ComponentFixture<BookingNotAgreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BookingNotAgreeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingNotAgreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
