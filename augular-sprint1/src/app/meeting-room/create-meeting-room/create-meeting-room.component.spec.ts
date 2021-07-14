import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateMeetingRoomComponent} from './create-meeting-room.component';

describe('CreateMeetingRoomComponent', () => {
  let component: CreateMeetingRoomComponent;
  let fixture: ComponentFixture<CreateMeetingRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateMeetingRoomComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMeetingRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
