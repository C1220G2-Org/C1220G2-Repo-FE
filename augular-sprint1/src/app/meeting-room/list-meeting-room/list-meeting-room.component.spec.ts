import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListMeetingRoomComponent} from './list-meeting-room.component';

describe('ListMeetingRoomComponent', () => {
  let component: ListMeetingRoomComponent;
  let fixture: ComponentFixture<ListMeetingRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListMeetingRoomComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMeetingRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
