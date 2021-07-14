import {TestBed} from '@angular/core/testing';

import {BookingRoomService} from './booking-room.service';

describe('BookingRoomService', () => {
  let service: BookingRoomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookingRoomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
