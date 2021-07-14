import {TestBed} from '@angular/core/testing';

import {MeetingRoomServiceService} from './meeting-room-service.service';

describe('MeetingRoomServiceService', () => {
  let service: MeetingRoomServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeetingRoomServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
