import {Component, OnInit} from '@angular/core';
import {MeetingRoomServiceService} from '../meeting-room-service.service';
import {MeetingRoom} from '../../models/meeting-room';
import {Router} from '@angular/router';
import {TokenStorageService} from '../../user/token-storage.service';

@Component({
  selector: 'app-list-meeting-room',
  templateUrl: './list-meeting-room.component.html',
  styleUrls: ['./list-meeting-room.component.css']
})
export class ListMeetingRoomComponent implements OnInit {

  meetingRoomList: MeetingRoom[] = [];
  nameSearch: string;
  capacitySearch: number;
  floorSearch: number;
  statusSearch: string;
  collectionSize = 0;
  page = 1;
  pageSize = 5;
  messageSearch = '';
  idDelete: number;
  nameDelete: string;
  showAdminBoard = false;
  showUserBoard = false;
  isLoggedIn = false;
  private roles: string[];

  constructor(private meetingRoomService: MeetingRoomServiceService,
              private router: Router,
              private tokenStorageService: TokenStorageService) {
  }

  ngOnInit(): void {
    this.listSearch();
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showUserBoard = this.roles.includes('ROLE_USER');
    }
  }

  // loadList() {
  //     this.meetingRoomService.findAll().subscribe(data => {
  //       this.meetingRoomList = data['content'];
  //       this.collectionSize = data['totalPages'];
  //     });
  // }

  setNameSearch($event: any) {
    this.nameSearch = $event.target.value;
  }

  setFloorSearch($event: any) {
    this.floorSearch = $event.target.value;
  }

  setStatusSearch($event: any) {
    this.statusSearch = $event.target.value;
  }

  setCapacitySearch($event: any) {
    this.capacitySearch = $event.target.value;
  }

  listSearch() {
    this.messageSearch = '';
    this.meetingRoomService.findSearch(this.nameSearch).subscribe(
      value => {
        this.meetingRoomList = value;
        if (this.meetingRoomList.length == 0) {
          this.messageSearch = 'Không tìm thấy phòng họp phù hợp.';
        }
      }
    );
  }

  passData(id: number, name: string) {
    this.idDelete = id;
    this.nameDelete = name;
  }

  deleteMeetingRoom() {
    this.meetingRoomService.deleteById(this.idDelete).subscribe(value => {
      this.listSearch();
    });

  }

}
