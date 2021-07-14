import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MeetingRoomRoutingModule} from './meeting-room-routing.module';
import {CreateMeetingRoomComponent} from './create-meeting-room/create-meeting-room.component';
import {ListMeetingRoomComponent} from './list-meeting-room/list-meeting-room.component';
import {EditMeetingRoomComponent} from './edit-meeting-room/edit-meeting-room.component';
import {DetailMeetingRoomComponent} from './detail-meeting-room/detail-meeting-room.component';
import {NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {ReactiveFormsModule} from '@angular/forms';
import {NgxSpinnerModule} from 'ngx-bootstrap-spinner';


@NgModule({
  declarations: [CreateMeetingRoomComponent, ListMeetingRoomComponent, EditMeetingRoomComponent, DetailMeetingRoomComponent],
  imports: [
    CommonModule,
    MeetingRoomRoutingModule,
    NgbPaginationModule,
    ReactiveFormsModule,
    NgxSpinnerModule,

  ]
})
export class MeetingRoomModule {
}
