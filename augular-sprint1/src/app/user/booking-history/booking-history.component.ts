import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {BookingRoomService} from 'src/app/booking-room/booking-room.service';
import {BookingCancellation} from 'src/app/models/booking-cancellation';
import {MeetingType} from 'src/app/models/meeting-type';
import {User} from 'src/app/models/user';

import {UserBooking} from 'src/app/models/user-booking';
import Swal from 'sweetalert2';
import {BookingCancellationService} from '../booking-cancellation.service';
import {TokenStorageService} from '../token-storage.service';
import {UserService} from '../user.service';


@Component({
  selector: 'app-booking-history',
  templateUrl: './booking-history.component.html',
  styleUrls: ['./booking-history.component.css']
})
export class BookingHistoryComponent implements OnInit {

  bookingList: UserBooking[] = [];
  userId: number;
  meetingTypeList: MeetingType[] = [];

  // pagination
  collectionSize: number;
  page: number;
  pageSize: number;

  //search reactive form.
  searchForm: FormGroup;
  build: FormBuilder;
  allUsers: User[] = [];

  //confirm cancel booking
  cancelBooking: UserBooking;
  confirmCancelForm: FormGroup;

  // authentication and authorization
  isLoggedIn: boolean = false;
  showAdminBoard: boolean = false;


  constructor(private userService: UserService, private activatedRoute: ActivatedRoute,
              @Inject(FormBuilder) private builder: FormBuilder, private toast: ToastrService,
              private bookingCancellationService: BookingCancellationService, private bookingService: BookingRoomService,
              private tokenStorageService: TokenStorageService) {
    this.build = this.builder;
    this.getAllUsers();
    this.createSearchForm();
    this.createConfirmCancelForm();
    this.cancelBooking = {
      bookingId: 0,
      userId: 0,
      roomName: '',
      content: '',
      registrationDate: '',
      floor: 0,
      status: '',
      startTime: '',
      endTime: '',
      meetingType: '',
      startDate: '',
      endDate: ''
    };
  }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.userId = user.id;
      if (user.roles.includes('ROLE_USER')) {
        this.getBookingListOfUser();
        this.showAdminBoard = false;
      } else {
        this.getBookingsOfAllUsers();
        this.showAdminBoard = true;
      }
    }
    this.getMeetingTypeList();
  }

  getAllUsers() {
    this.userService.getAllUser().subscribe(
      data => {
        if (data) {
          this.allUsers = data['content'];
        } else {
          this.toast.error('Không có dữ liệu trong hệ thống', 'Thông Báo');
        }
      }
    );
  }

  getMeetingTypeList() {
    this.bookingService.getMeetingType().subscribe(
      data => this.meetingTypeList = data
    );
  }

  getBookingsOfAllUsers() {
    this.userService.getBookingsOfAllUsers().subscribe(
      allBookings => {
        this.bookingList = allBookings;

        if (this.bookingList === null) {
          this.toast.warning('Thông tin dữ liệu hiện không có trong hệ thống', 'Thông báo');
        } else {
          this.collectionSize = this.bookingList.length;
          this.page = 1;
          this.pageSize = 5;
        }
      }
    );
  }

  getBookingListOfUser() {
    this.userService.getUserBookingHistory(this.userId).subscribe(
      bookings => {
        this.bookingList = bookings;
        if (this.bookingList === null) {
          this.toast.warning('Thông tin dữ liệu hiện không có trong hệ thống', 'Thông báo');
        } else {
          this.collectionSize = this.bookingList.length;
          this.page = 1;
          this.pageSize = 5;
        }
      }
    );
  }

  createSearchForm(): void {
    this.searchForm = this.build.group({
      searchUserId: [0],
      roomName: ['', Validators.maxLength(10)],
      rangeDate: [''],
      status: [''],
      meetingType: [''],
      registrationDate: ['']
    });
  }

  get searchUserId() {
    return this.searchForm.get('searchUserId');
  }

  get roomName() {
    return this.searchForm.get('roomName');
  }

  get rangeDate() {
    return this.searchForm.get('rangeDate');
  }

  get status() {
    return this.searchForm.get('status');
  }

  get meetingType() {
    return this.searchForm.get('meetingType');
  }

  get registrationDate() {
    return this.searchForm.get('registrationDate');
  }

  createConfirmCancelForm() {
    this.confirmCancelForm = new FormGroup({
      roomNameOfBooking: new FormControl(''),
      userIdOfBooking: new FormControl(0),
      cancellationTime: new FormControl(new Date()),
      cancellationReason: new FormControl('', [Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100)]),
      roomBookingId: new FormControl(0)
    });
  }

  get roomBookingId() {
    return this.confirmCancelForm.get('roomBookingId');
  }

  get roomNameOfBooking() {
    return this.confirmCancelForm.get('roomNameOfBooking');
  }

  get userIdOfBooking() {
    return this.confirmCancelForm.get('userIdOfBooking');
  }

  get cancellationTime() {
    return this.confirmCancelForm.get('cancellationTime');
  }

  get cancellationReason() {
    return this.confirmCancelForm.get('cancellationReason');
  }


  // Search feature................
  onSearchSubmit() {
    let startDate: string = null, endDate: string = null;
    if (this.searchForm.get('rangeDate').value) {
      let startDateValue: Date = new Date(this.searchForm.get('rangeDate').value[0]);
      startDateValue.setDate(startDateValue.getDate() + 1);
      startDate = startDateValue.toISOString().slice(0, 10);


      let endDateValue: Date = new Date(this.searchForm.get('rangeDate').value[1]);
      endDateValue.setDate(endDateValue.getDate() + 1);
      endDate = endDateValue.toISOString().slice(0, 10) + ' 23:59:00';
    }


    let roomName: string = this.searchForm.get('roomName').value;

    let status: string = this.searchForm.get('status').value;

    let meetingType: string = this.searchForm.get('meetingType').value;

    let searchUserId: number = this.searchForm.get('searchUserId').value;


    let registrationDate: string = null;
    if (this.searchForm.get('registrationDate').value) {
      let registrationDateTemp: Date = new Date(this.searchForm.get('registrationDate').value);
      registrationDateTemp.setDate(registrationDateTemp.getDate() + 1);
      registrationDate = registrationDateTemp.toISOString().slice(0, 10);
    }

    let result: Observable<any>;
    if (this.showAdminBoard) {
      result = this.userService.searchBookingHistoryOnAdmin(searchUserId, roomName, startDate, endDate,
        status, meetingType, registrationDate);
    } else {
      result = this.userService.searchUserBookingHistory(this.userId, roomName, startDate, endDate,
        status, meetingType, registrationDate);
    }

    result.subscribe(
      foundBookings => {
        this.bookingList = foundBookings;
        this.collectionSize = this.bookingList.length;
        this.page = 1;

        if (this.collectionSize === 0) {
          this.toast.info('Không tìm thấy kết quả trùng khớp', 'Thông báo');
        }
      }
    );

    // Confirm cancel booking.
  }

  setUpConfirmCancelModal(booking: UserBooking) {

    if (booking.status === 'Đã sử dụng' || booking.status === 'Đang sử dụng') {
      Swal.fire({
        icon: 'error',
        title: 'Thao tác hủy thất bại!',
        text: 'Bạn không thể hủy phòng đã được sử dụng.',
      });
    } else {
      this.cancelBooking = booking;
      this.confirmCancelForm = new FormGroup({
        roomNameOfBooking: new FormControl(this.cancelBooking.roomName),
        userIdOfBooking: new FormControl(this.cancelBooking.userId),
        cancellationTime: new FormControl(new Date()),
        cancellationReason: new FormControl('', [Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100)]),
        roomBookingId: new FormControl(this.cancelBooking.bookingId),
        bookingStatus: new FormControl(this.cancelBooking.status)
      });
    }
  }


  onSubmitConfirmForm() {
    let cancellationTimeDate: Date = this.confirmCancelForm.get('cancellationTime').value;

    let bookingCancellation: BookingCancellation = {
      'cancellationReason': this.confirmCancelForm.get('cancellationReason').value,
      'cancellationTime': cancellationTimeDate.toDateString() + ' ' + cancellationTimeDate.toTimeString(),
      'userId': this.confirmCancelForm.get('userIdOfBooking').value,
      'roomName': this.confirmCancelForm.get('roomNameOfBooking').value,
      'bookingId': this.confirmCancelForm.get('roomBookingId').value
    };

    this.bookingCancellationService.saveBookingCancellation(bookingCancellation).subscribe(
      () => {
        this.toast.success('Hủy bỏ đặt phòng thành công', 'Thông Báo');
        this.getBookingListOfUser();
      },
      err => this.toast.error('Hủy bỏ đặt phòng thất bại', 'Thông Báo')
    );

  }

}

