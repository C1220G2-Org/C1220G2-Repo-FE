import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {BookingRoomRoutingModule} from './booking-room-routing.module';
import {BookMeetingRoomComponent} from './book-meeting-room/book-meeting-room.component';
import {CancelBookingComponent} from './cancel-booking/cancel-booking.component';
import {ListBookingComponent} from './list-booking/list-booking.component';
import {SearchEmptyRoomComponent} from './search-empty-room/search-empty-room.component';
import {ScreenBookingRoomComponent} from './screen-booking-room/screen-booking-room.component';
import {
  AgendaService,
  DayService,
  MonthService,
  ScheduleModule,
  WeekService,
  WorkWeekService,
  YearService
} from '@syncfusion/ej2-angular-schedule';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import {CheckBoxModule} from '@syncfusion/ej2-angular-buttons';
import {MeetingRoomServiceService} from '../meeting-room/meeting-room-service.service';
import {NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {BookingAgreeComponent} from './booking-agree/booking-agree.component';
import {BookingNotAgreeComponent} from './booking-not-agree/booking-not-agree.component';


@NgModule({
  declarations: [
    BookMeetingRoomComponent,
    CancelBookingComponent,
    ListBookingComponent,
    SearchEmptyRoomComponent,
    ScreenBookingRoomComponent,
    BookingAgreeComponent,
    BookingNotAgreeComponent
  ],
  imports: [
    CommonModule, ScheduleModule,
    BookingRoomRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule, CheckBoxModule, NgbPaginationModule
  ],
  exports: [
    ScreenBookingRoomComponent,
    BookMeetingRoomComponent,
    SearchEmptyRoomComponent
  ],
  providers: [
    AgendaService,
    DayService,
    WeekService,
    WorkWeekService,
    MonthService,
    YearService,
    MeetingRoomServiceService
  ]
})
export class BookingRoomModule {
}
