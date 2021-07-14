import {Component, DoCheck, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {MeetingType} from '../../models/meeting-type';
import {MeetingRoom} from '../../models/meeting-room';
import {Validation} from './Validation';
import {BookingRoomService} from '../booking-room.service';
import {User} from '../../models/user';
import {TokenStorageService} from 'src/app/user/token-storage.service';
import {ToastrService} from 'ngx-toastr';
import Swal from 'sweetalert2';
import {BookingCancellation} from '../../models/booking-cancellation';
import {BookingCancellationService} from '../../user/booking-cancellation.service';


export class Hour {
  name: string;
}

@Component({
  selector: 'app-book-meeting-room',
  templateUrl: './book-meeting-room.component.html',
  styleUrls: ['./book-meeting-room.component.css']
})
export class BookMeetingRoomComponent implements OnInit, DoCheck {

  listMeetingRoom: MeetingRoom[] = [];
  listMeetingType: MeetingType[] = [];
  listHours: Hour[] = [];
  public createForm!: FormGroup;

  public meetingRoomVariable?: any;
  public meetingTypeVariable?: any;
  public startDateVariable: string = '';
  public endDateVariable: string = '';
  startHourVariable: string = '';
  endHourVariable: string = '';
  public contentVariable: string = '';
  public meetingRoomVariableID: number = 0;
  public meetingTypeVariableID: number = 0;

  // Get logged in user.
  private user: User;
  isLoggedIn: boolean = false;
  test: any;

  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute,
              private route: Router, private bookingService: BookingRoomService,
              private tokenStorageService: TokenStorageService,
              private toastr: ToastrService,
              private bookingCancellationService: BookingCancellationService) {
  }

  ngOnInit(): void {

    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      this.user = this.tokenStorageService.getUser();
    }

    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      this.meetingRoomVariableID = parseInt(<any> paramMap.get('meetingRoom'));
      this.meetingTypeVariableID = parseInt(<any> paramMap.get('meetingType'));
      this.startDateVariable = <string> paramMap.get('startDateVariable');
      this.endDateVariable = <string> paramMap.get('endDateVariable');
      this.startHourVariable = <string> paramMap.get('startHourVariable');
      this.endHourVariable = <string> paramMap.get('endHourVariable');
      this.contentVariable = <string> paramMap.get('subject');
    });

    // this.listHours = [{'name': 'chọn giờ'}, {'name': '08:00:00'}, {'name': '09:00:00'}, {'name': '10:00:00'}, {'name': '11:00:00'}, {'name': '12:00:00'},
    //   {'name': '13:00:00'}, {'name': '14:00:00'}, {'name': '15:00:00'}, {'name': '16:00:00'}, {'name': '17:00:00'}, {'name': '18:00:00'},
    //   {'name': '19:00:00'}, {'name': '20:00:00'}, {'name': '21:00:00'}];

    let listMeetingRoomInit = this.bookingService.getMeetingRoom().subscribe(data => {
      this.listMeetingRoom = data;

      let listMeetingTypeInit = this.bookingService.getMeetingType().subscribe(data => {
        this.listMeetingType = data;

        for (let i = 0; i < this.listMeetingRoom.length; i++) {
          if (this.listMeetingRoom[i].id == this.meetingRoomVariableID) {
            this.meetingRoomVariable = this.listMeetingRoom[i];
          }
        }
        this.checkBookRoomAfterCancel();
        for (let i = 0; i < this.listMeetingType.length; i++) {
          if (this.listMeetingType[i].id == this.meetingTypeVariableID) {
            this.meetingTypeVariable = this.listMeetingType[i];
          }
        }

      }, error => {
        console.log('get ' + error);
      });
    }, error => {
      console.log('get ' + error);
    });

    this.initForm();
  }

  ngDoCheck(): void {


  }

  initForm() {
    this.createForm = this.fb.group({
      meetingRoom: ['', [Validators.required]],
      meetingType: [this.listMeetingType[0]],
      dateGroup: this.fb.group({
          startDate: ['', [Validators.required, Validators.pattern('^[0-9]{4}-[01][0-9]-[0123][0-9]$'), Validation.checkdate]],
          endDate: ['', [Validators.required, Validators.pattern('^[0-9]{4}-[01][0-9]-[0123][0-9]$'), Validation.checkdate]],
        },
        {validators: [Validation.compareDate, Validation.compareDate30]},
      ),

      hoursGroup: this.fb.group({
          startHour: ['', [Validators.required]],
          endHour: ['', [Validators.required]]
        },
        {validators: Validation.compareHour}
      ),
      content: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  errorMessage = '';

  save() {
    let bookingRoom = this.createForm.value;
    var today = new Date();
    let startDate;
    let endDate;
    let days;
    let list: Array<any> = [];
    let listSearch: Array<MeetingRoom> = [];
    // console.log(bookingRoom);
    let temp = '';
    let temp2 = '';
    console.log(typeof this.meetingRoomVariable);
    if (this.meetingRoomVariable == null) {
      temp = '';
    } else {
      temp = this.meetingRoomVariable.id;
    }
    if (this.meetingTypeVariable == null) {
      temp2 = '';
    } else {
      temp2 = this.meetingTypeVariable.id;
    }
    this.bookingService.searchEmpty(temp, 1, this.startDateVariable, this.endDateVariable, this.startHourVariable + ':00', this.endHourVariable + ':00', 0).subscribe(data => {
      listSearch = data;
      if (listSearch.length == 0) {
        this.showError();
      } else {
        if ((listSearch[0].status != 'Có thể sử dụng')) {
          this.showErrorNotUse();
        } else {
          startDate = Date.parse(bookingRoom.dateGroup.startDate);
          endDate = Date.parse(bookingRoom.dateGroup.endDate);
          days = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
          let dateTemp;
          for (let i = 0; i <= days; i++) {
            dateTemp = new Date(Date.parse(bookingRoom.dateGroup.startDate) + (i * (1000 * 60 * 60 * 24)));
            list[i] = {
              content: bookingRoom.content,
              registrationDate: today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate(),
              startDate: '' + dateTemp.getFullYear() + '-' + (dateTemp.getMonth() + 1) + '-' + dateTemp.getDate() + ' ' + bookingRoom.hoursGroup.startHour,
              endDate: '' + dateTemp.getFullYear() + '-' + (dateTemp.getMonth() + 1) + '-' + dateTemp.getDate() + ' ' + bookingRoom.hoursGroup.endHour,
              meetingRoom: bookingRoom.meetingRoom,
              meetingType: this.listMeetingType[0],
              user: this.user
            };
          }
          console.log('this.user.roles[0].id');
          console.log(this.user.roles);
          if (this.user.roles[0] == 'ROLE_ADMIN') {
            console.log('da vao');
            this.bookingService.postBookingRoomArray(list).subscribe(() => {
              this.showInfo();
              this.route.navigateByUrl('dat-phong-hop/man-hinh');
            });
          } else {
            console.log(days);
            if (days > 0 && days <= 30) {
              let code = '';
              code = this.makeid();
              let list2 = [];
              for (let i = 0; i <= days; i++) {
                dateTemp = new Date(Date.parse(bookingRoom.dateGroup.startDate) + (i * (1000 * 60 * 60 * 24)));
                list2[i] = {
                  content: bookingRoom.content,
                  registrationDate: today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate(),
                  startDate: '' + dateTemp.getFullYear() + '-' + (dateTemp.getMonth() + 1) + '-' + dateTemp.getDate() + ' ' + bookingRoom.hoursGroup.startHour,
                  endDate: '' + dateTemp.getFullYear() + '-' + (dateTemp.getMonth() + 1) + '-' + dateTemp.getDate() + ' ' + bookingRoom.hoursGroup.endHour,
                  meetingRoom: bookingRoom.meetingRoom,
                  meetingType: this.listMeetingType[0],
                  user: this.user,
                  code: code,
                  status: 0
                };
              }
              this.bookingService.postBookingRoomPending(list2).subscribe(() => {
                this.showWarning();
                this.bookingService.callAdmin(this.user.id, code, this.startDateVariable, this.endDateVariable, this.startHourVariable, this.endHourVariable, this.meetingRoomVariable.name).subscribe();
              });
              this.route.navigateByUrl('dat-phong-hop/man-hinh');
            } else if (days == 0) {
              this.bookingService.postBookingRoomArray(list).subscribe(() => {
                console.log(list);
                this.showInfo();
                this.route.navigateByUrl('dat-phong-hop/man-hinh');
              });
            } else {
              this.showError30();
            }
          }
        }
      }
    });
  }

  // Kha code.
  checkBookRoomAfterCancel() {
    let roomName: string = this.meetingRoomVariable.name;
    console.log('room id: ' + this.meetingRoomVariable.id);
    console.log('room name: ' + this.meetingRoomVariable.name);
    this.bookingCancellationService.getBookingCancellationsOfUser(this.user.id).subscribe(
      data => {
        let bookingCancellationList: BookingCancellation[] = data;
        console.log('cancellation list: ' + bookingCancellationList);
        for (let i = 0; i < bookingCancellationList.length; i++) {
          if (bookingCancellationList[i].roomName === roomName) {
            let timeNow = new Date().getTime();
            let timeCancel = new Date(bookingCancellationList[i].cancellationTime).getTime();
            let minuteDiff = (timeNow - timeCancel) / 60000;
            if (minuteDiff <= 60) {
              let timeLeft = (60 - minuteDiff).toPrecision(2);
              Swal.fire(
                'Vui lòng chọn phòng khác.',
                'Bạn mới hủy đăng ký phòng ' + roomName + '. Có thể đăng ký lại sau ' + timeLeft + ' phút.',
                'info'
              );
            } else {
              this.bookingCancellationService.deleteBookingCancellationByRoomIdAndUserId(this.meetingRoomVariable.id, this.user.id).subscribe();
            }
          }
        }
      }
    );
  }

  // ----------------------------------------------


  combackSearchEmty() {
    console.log(this.createForm.value);


    this.route.navigate(['dat-phong-hop/searchEmpty', this.meetingRoomVariable.id, this.listMeetingType[0].id, this.startDateVariable, this.endDateVariable, this.startHourVariable, this.endHourVariable]);
  }

  get startDate() {
    // @ts-ignore
    return this.createForm.get('dateGroup')?.get('startDate'); // ten
  }

  get endDate() {
    // @ts-ignore
    return this.createForm.get('dateGroup')?.get('endDate'); // ten
  }

  get dateGroup() {
    // @ts-ignore
    return this.createForm.get('dateGroup'); // group
  }

  get content() {
    return this.createForm.get('content');
  }

  get endHour() {
    // @ts-ignore
    return this.createForm.get('hoursGroup')?.get('endHour');
  }

  get startHour() {
    // @ts-ignore
    return this.createForm.get('hoursGroup')?.get('startHour');
  }

  makeid(): string {
    var text = '';
    var possible = '0123456789';

    for (var i = 0; i < 30; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }

  showError() {
    Swal.fire({
      title: 'Bạn không thể thêm mới vì có giờ hoặc điều kiện trùng lặp!',
      text: this.errorMessage,
      icon: 'error',
      confirmButtonText: 'Đóng'
    });
  }

  showInfo() {
    Swal.fire({
      title: 'Bạn đã thêm lịch họp thành công!',
      text: this.errorMessage,
      icon: 'success',
      confirmButtonText: 'Đóng'
    });
  }

  showWarning() {
    Swal.fire({
      title: 'Bạn đã đặt quá 2 ngày , cần xác nhận từ Admin!',
      text: this.errorMessage,
      icon: 'warning',
      confirmButtonText: 'Đóng'
    });
  }

  showError30() {
    Swal.fire({
      title: 'Bạn không thể thêm mới vì ngày đặt lớn hơn 30 ngày!',
      text: this.errorMessage,
      icon: 'error',
      confirmButtonText: 'Đóng'
    });
  }

  showErrorNotUse() {
    Swal.fire({
      title: 'Bạn không thể đăng ký lịch họp vì phòng không thể sử dụng.',
      text: this.errorMessage,
      icon: 'error',
      confirmButtonText: 'Đóng'
    });
  }
}
