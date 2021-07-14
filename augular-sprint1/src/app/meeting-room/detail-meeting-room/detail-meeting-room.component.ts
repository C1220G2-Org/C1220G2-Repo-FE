import {Component, OnInit} from '@angular/core';
import {MeetingRoomServiceService} from '../meeting-room-service.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MeetingRoom} from '../../models/meeting-room';
import {PropertyDto} from '../../models/property-dto';
import {User} from '../../models/user';
import {TokenStorageService} from '../../user/token-storage.service';

@Component({
  selector: 'app-detail-meeting-room',
  templateUrl: './detail-meeting-room.component.html',
  styleUrls: ['./detail-meeting-room.component.css']
})
export class DetailMeetingRoomComponent implements OnInit {
  meetingRoom: MeetingRoom;
  id: number;
  idMeetingRoom: number;
  properties: PropertyDto[] = [];
  images: string[] = [];
  user: User;
  isLoggedIn: boolean = false;

  constructor(private meetingRoomService: MeetingRoomServiceService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private tokenStorageService: TokenStorageService) {
  }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      this.user = this.tokenStorageService.getUser();
    }
    this.idMeetingRoom = Number(this.activatedRoute.snapshot.params.id);
    this.meetingRoomService.findById(this.idMeetingRoom).subscribe(value => {
      this.meetingRoom = value;
      console.log(this.meetingRoom.images);
    });
  }
}
