import {Component, DoCheck, OnInit,} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {BookingRoomService} from '../booking-room.service';
import {MeetingRoom} from '../../models/meeting-room';
import {MeetingType} from '../../models/meeting-type';
import {Hour} from '../book-meeting-room/book-meeting-room.component';
import {Validation} from '../book-meeting-room/Validation';
import {BookingRoom} from '../../models/booking-room';
import {forkJoin} from 'rxjs';
import {User} from '../../models/user';
import {TokenStorageService} from 'src/app/user/token-storage.service';
import {ToastrService} from 'ngx-toastr';
import {BookingCancellationService} from 'src/app/user/booking-cancellation.service';
import {BookingCancellation} from 'src/app/models/booking-cancellation';
import {Property} from '../../models/property';
import {PropertyServiceService} from '../../property/property-service.service';
import {any} from 'codelyzer/util/function';
import {MeetingRoomServiceService} from '../../meeting-room/meeting-room-service.service';

@Component({
  selector: 'app-search-empty-room',
  templateUrl: './search-empty-room.component.html',
  styleUrls: ['./search-empty-room.component.css']
})
export class SearchEmptyRoomComponent implements OnInit, DoCheck {
  public listMeetingRoom: MeetingRoom[] = [];
  public listMeetingType: MeetingType[] = [];
  public listHours: Hour[] = [];
  public searchForm!: FormGroup;
  public meetingRoomVariable: any = null;
  public meetingRoomVariableID: any;
  public meetingTypeVariableID: any;
  public meetingTypeVariable: any;
  public startDateVariable: string = '';
  public endDateVariable: string = '';
  public startHourVariable: string = '';
  public endHourVariable: string = '';
  public listSearch: MeetingRoom[] = [];
  public capacity: number = 0;
  public listProperty: any;
  public listCheckProperty: any[];


  // Get logged in user.
  private user: User;
  isLoggedIn: boolean = false;

  page: number = 1;
  pageSize: number = 5;
  collectionSize: number = 0;


  ngDoCheck(): void {


  }

  // changeSelection() {
  //   this.fetchSelectedItems()
  // }
  //
  // fetchSelectedItems() {
  //   this.selectedItemsList = this.listCheckProperty.filter((value, index) => {
  //     console.log(value);
  //     return value.isChecked
  //   });
  // }
  //
  // fetchCheckedIDs() {
  //   this.checkedIDs = []
  //   this.listCheckProperty.forEach((value, index) => {
  //     if (value.isChecked) {
  //       this.checkedIDs.push(value.id);
  //     }
  //   });
  // }

  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute,
              private bookingService: BookingRoomService, private tokenStorageService: TokenStorageService,
              private toastr: ToastrService, private propertyServiceService: PropertyServiceService, private bookingCancellationService: BookingCancellationService,
              private router: Router, private meetingRoomServiceService: MeetingRoomServiceService) {
  }

  ngOnInit(): void {
    // this.fetchSelectedItems()
    // this.fetchCheckedIDs()

    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      this.user = this.tokenStorageService.getUser();
    }


    this.listHours = [{'name': 'chọn giờ'}, {'name': '08:00:00'}, {'name': '09:00:00'}, {'name': '10:00:00'}, {'name': '11:00:00'}, {'name': '12:00:00'},
      {'name': '13:00:00'}, {'name': '14:00:00'}, {'name': '15:00:00'}, {'name': '16:00:00'}, {'name': '17:00:00'}, {'name': '18:00:00'},
      {'name': '19:00:00'}, {'name': '20:00:00'}, {'name': '21:00:00'}];

    // this.meetingRoomServiceService.findAll().subscribe(data=> {
    //   this.listSearch = data;
    //   // @ts-ignore
    //   this.listSearch= this.listSearch.content;
    //   console.log( this.listSearch);
    // })


    this.propertyServiceService.getAll().subscribe(data => {
      this.listProperty = data;
      let listCheckProperty = [];
      console.log(this.listProperty.content);
      this.listProperty = this.listProperty.content;

      for (let i = 0; i < this.listProperty.length; i++) {
        listCheckProperty[i] = {
          id: this.listProperty[i].id,
          isCheck: false
        };
      }
      this.listCheckProperty = listCheckProperty;
      console.log(listCheckProperty);
    });


    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      this.meetingRoomVariableID = parseInt(<any> paramMap.get('meetingRoom'));
      this.meetingTypeVariableID = parseInt(<any> paramMap.get('meetingType'));
      this.startDateVariable = <string> paramMap.get('startDateVariable');
      this.endDateVariable = <string> paramMap.get('endDateVariable');
      this.startHourVariable = <string> paramMap.get('startHourVariable');
      this.endHourVariable = <string> paramMap.get('endHourVariable');
    });


    let listMeetingRoomInit = this.bookingService.getMeetingRoom().subscribe(data => {
      this.listMeetingRoom = data;

      let listMeetingTypeInit = this.bookingService.getMeetingType().subscribe(data => {
        this.listMeetingType = data;

        for (let i = 0; i < this.listMeetingRoom.length; i++) {
          if (this.listMeetingRoom[i].id == this.meetingRoomVariableID) {
            this.meetingRoomVariable = this.listMeetingRoom[i];
          }
        }

        for (let i = 0; i < this.listMeetingType.length; i++) {
          if (this.listMeetingType[i].id == this.meetingTypeVariableID) {
            this.meetingTypeVariable = this.listMeetingType[i];
          }
        }
      }, error => {
      });
    }, error => {
    });


    this.initForm();

  }


  initForm() {
    this.searchForm = this.fb.group({
      meetingRoom: [''],
      meetingType: ['',],
      capacityForm: ['', [Validators.min(0)]],
      dateGroup: this.fb.group({
          startDate: ['', [Validators.required, Validators.pattern('^[0-9]{4}-[01][0-9]-[0123][0-9]$'), Validation.checkdate]],
          endDate: ['', [Validators.required, Validators.pattern('^[0-9]{4}-[01][0-9]-[0123][0-9]$'), Validation.checkdate]],
        },
        {validators: Validation.compareDate}
      ),

      hoursGroup: this.fb.group({
          startHour: ['', [Validators.required]],
          endHour: ['', [Validators.required]]
        },
        {validators: Validation.compareHour}
      ),

    });
  }

  search() {

    let temp = '';
    let temp2 = '';
    let temp3 = 0;
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
    if (this.capacity == null) {
      temp3 = 0;
    } else {
      temp3 = this.capacity;
    }


    this.bookingService.searchEmpty(temp, 1, this.startDateVariable, this.endDateVariable, this.startHourVariable, this.endHourVariable, temp3).subscribe(data => {
      this.listSearch = data;
      this.collectionSize = data.length;
      console.log(this.listSearch);

      let arrProperty = [];

      for (let i = 0; i < this.listCheckProperty.length; i++) {
        if ((this.listCheckProperty[i].isCheck == true)) {
          arrProperty.push(this.listCheckProperty[i].id);
        }
      }
      console.log(arrProperty);
      console.log(this.listSearch);

      let arrNewListSearch = [];
      let lenghtS = 0;
      for (let i = 0; i < this.listSearch.length; i++) {

        if (this.listSearch[i].ratings.length == 0) {
          continue;
        }
        let arrSCount = 0;
        for (let j = 0; j < this.listSearch[i].ratings.length; j++) {
          for (let k = 0; k < arrProperty.length; k++) {
            // @ts-ignore
            console.log('PROPERTY ID =  ' + this.listSearch[i].ratings[j].property.id);
            // @ts-ignore
            if (this.listSearch[i].ratings[j].property.id == arrProperty[k]) {
              arrSCount++;
            }
          }
        }
        if (arrSCount == arrProperty.length) {
          arrNewListSearch.push(this.listSearch[i]);
        }
      }
      console.log(arrNewListSearch);
      this.listSearch = arrNewListSearch;

      if (this.listSearch.length == 0) {
        this.toastr.info('Tìm kiếm của bạn đã bị trùng lặp hoặc không có điều kiện phù hợp', 'Thông Báo');
      }
    }, error => {
      console.log('get ' + error + ' at getListType ');

    });
  }

  get startDate() {
    // @ts-ignore
    return this.searchForm.get('dateGroup')?.get('startDate');
  }

  get endDate() {
    // @ts-ignore
    return this.searchForm.get('dateGroup')?.get('endDate');
  }

  get endHour() {
    // @ts-ignore
    return this.searchForm.get('hoursGroup')?.get('endHour');
  }

  get startHour() {
    // @ts-ignore
    return this.searchForm.get('hoursGroup')?.get('startHour');
  }

  get dateGroup() {
    // @ts-ignore
    return this.searchForm.get('dateGroup');
  }

  create(id: any) {
  }

  checkValid(id: number) {
    console.log('/dat-phong-hop/create/' + id + '/' + this.meetingTypeVariable + '/' +
      this.startDateVariable + '/' + this.endDateVariable + '/' +
      this.startHourVariable + '/' + this.endHourVariable);
    this.router.navigateByUrl('/dat-phong-hop/create/' + id + '/' + 1 + '/' +
      this.startDateVariable + '/' + this.endDateVariable + '/' +
      this.startHourVariable + '/' + this.endHourVariable);
  }

  checkCheckBoxvalue(id: any,) {
    for (let i = 0; i < this.listCheckProperty.length; i++) {
      if (this.listCheckProperty[i].id == id) {
        this.listCheckProperty[i].isCheck = !this.listCheckProperty[i].isCheck;
      }
    }
    console.log(this.listCheckProperty);
  }
}

