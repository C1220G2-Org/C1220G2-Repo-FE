import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DetailMeetingRoomComponent} from './detail-meeting-room.component';

describe('DetailMeetingRoomComponent', () => {
  let component: DetailMeetingRoomComponent;
  let fixture: ComponentFixture<DetailMeetingRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DetailMeetingRoomComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailMeetingRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
