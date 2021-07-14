import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EditMeetingRoomComponent} from './edit-meeting-room.component';

describe('EditMeetingRoomComponent', () => {
  let component: EditMeetingRoomComponent;
  let fixture: ComponentFixture<EditMeetingRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditMeetingRoomComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMeetingRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
