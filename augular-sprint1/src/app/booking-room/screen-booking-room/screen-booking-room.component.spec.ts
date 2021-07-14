import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ScreenBookingRoomComponent} from './screen-booking-room.component';

describe('ScreenBookingRoomComponent', () => {
  let component: ScreenBookingRoomComponent;
  let fixture: ComponentFixture<ScreenBookingRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScreenBookingRoomComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenBookingRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
