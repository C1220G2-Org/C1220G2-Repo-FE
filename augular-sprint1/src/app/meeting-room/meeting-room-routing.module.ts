import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {EditMeetingRoomComponent} from './edit-meeting-room/edit-meeting-room.component';
import {ListMeetingRoomComponent} from './list-meeting-room/list-meeting-room.component';
import {DetailMeetingRoomComponent} from './detail-meeting-room/detail-meeting-room.component';
import {CreateMeetingRoomComponent} from './create-meeting-room/create-meeting-room.component';


const routes: Routes = [
  {
    path: 'cap-nhat/:id',
    component: EditMeetingRoomComponent
  },
  {
    path: 'danh-sach',
    component: ListMeetingRoomComponent
  },
  {
    path: 'chi-tiet/:id',
    component: DetailMeetingRoomComponent
  },
  {
    path: 'tao-moi',
    component: CreateMeetingRoomComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeetingRoomRoutingModule {
}
