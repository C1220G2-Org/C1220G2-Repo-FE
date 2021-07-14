import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ScreenBookingRoomComponent} from './screen-booking-room/screen-booking-room.component';

import {SearchEmptyRoomComponent} from './search-empty-room/search-empty-room.component';
import {BookMeetingRoomComponent} from './book-meeting-room/book-meeting-room.component';
import {BookingAgreeComponent} from './booking-agree/booking-agree.component';
import {BookingNotAgreeComponent} from './booking-not-agree/booking-not-agree.component';


const routes: Routes = [
  {
    path: 'man-hinh',
    component: ScreenBookingRoomComponent
  },
  {path: 'searchEmpty', component: SearchEmptyRoomComponent},
  {path: 'create', component: BookMeetingRoomComponent},
  {
    path: 'searchEmpty/:meetingRoom/:meetingType/:startDateVariable/:endDateVariable/:startHourVariable/:endHourVariable',
    component: SearchEmptyRoomComponent
  },
  {path: 'searchEmpty/:meetingRoom/:meetingType/:startHourVariable/:endHourVariable', component: SearchEmptyRoomComponent},
  {
    path: 'create/:meetingRoom/:meetingType/:startDateVariable/:endDateVariable/:startHourVariable/:endHourVariable',
    component: BookMeetingRoomComponent
  },
  {path: 'create/:meetingRoom/:meetingType/:startHourVariable/:endHourVariable', component: BookMeetingRoomComponent},
  {
    path: 'agree/:userId/:startDateVariable/:endDateVariable/:startHourVariable/:endHourVariable/:meetingRoomName',
    component: BookingAgreeComponent
  },
  {
    path: 'notagree/:userId/:startDateVariable/:endDateVariable/:startHourVariable/:endHourVariable/:meetingRoomName',
    component: BookingNotAgreeComponent
  },
  {
    path: 'create/:meetingRoom/:meetingType/:startDateVariable/:endDateVariable/:startHourVariable/:endHourVariable/:subject',
    component: BookMeetingRoomComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingRoomRoutingModule {
}
