import {Component, DoCheck, HostListener, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {
  EventSettingsModel,
  ScheduleComponent,
  View,
  EventRenderedArgs,
  RenderCellEventArgs,
  ActionEventArgs
} from '@syncfusion/ej2-angular-schedule';
import {DataManager, WebApiAdaptor, Query, Predicate, ReturnOption} from '@syncfusion/ej2-data';
import {loadCldr, extend} from '@syncfusion/ej2-base';
import {L10n} from '@syncfusion/ej2-base';
import {BookingRoomService} from '../booking-room.service';
import {Router} from '@angular/router';
import {CheckBoxComponent} from '@syncfusion/ej2-angular-buttons';
import {MeetingRoomServiceService} from '../../meeting-room/meeting-room-service.service';
import {MeetingRoom} from '../../models/meeting-room';
import {ViewportScroller} from '@angular/common';

declare var require: any;
loadCldr(
  require('cldr-data/supplemental/numberingSystems.json'),
  require('cldr-data/main/vi/ca-gregorian.json'),
  require('cldr-data/main/vi/numbers.json'),
  require('cldr-data/main/vi/timeZoneNames.json'));
L10n.load({
  'vi': {
    'schedule': {
      'day': 'Ngày'
      ,
      'workWeek': 'Tuần'
      ,
      'month': 'Tháng'
      ,
      'year': 'Năm',
      'today': 'Hôm nay',
      'save': 'Bổ sung thông tin'
      ,
      'addTitle': '',
    },
    'calendar': {
      'today': 'Hôm nay',
    }
  }
});

@Component({
  selector: 'app-screen-booking-room',
  templateUrl: './screen-booking-room.component.html',
  styleUrls: ['./screen-booking-room.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ScreenBookingRoomComponent implements OnInit {
  title = 'Lịch họp';
  public selectedDate: Date = new Date();
  private URL = 'http://localhost:8080/api/roombooking';
  public startHour: string = '08:00';
  public endHour: string = '21:00';
  private dataManger: DataManager;
  public eventSettings: EventSettingsModel;
  @ViewChild('scheduleObj') public scheduleObj: ScheduleComponent;
  public scheduleView: View = 'WorkWeek';
  private items: Object[];
  public list: MeetingRoom[];
  public listId: number[] = [];
  pageYoffset = 0;

  @HostListener('window:scroll', ['$event']) onScroll(event) {
    this.pageYoffset = window.pageYOffset;
  }

  scrollToTop() {
    this.scroll.scrollToPosition([0, 0]);
  }

  constructor(private bookingRoomService: BookingRoomService,
              private route: Router,
              private meetingRoomService: MeetingRoomServiceService,
              private scroll: ViewportScroller) {
    this.renderMeetingRoomList();
  }

  ngOnInit(): void {
    setTimeout(() => this.renderData(), 500);
  }

  onRenderCell(args: RenderCellEventArgs): void {
    if (args.date < new Date()) {
      args.element.classList.add('e-disable-dates');
    }
  }

  renderMeetingRoomList() {
    this.meetingRoomService.findAll().subscribe(data => {
      this.list = data['content'];
      for (let i = 0; i < this.list.length; i++) {
        this.listId.push(this.list[i].id);
      }
    });
  }

  renderData() {
    this.bookingRoomService.findAll(this.listId).subscribe(data => {
      this.items = data;
      this.eventSettings = {dataSource: <Object[]> extend([], this.items, null, true), enableTooltip: true};
    });
  }

  onActionBegin(args: ActionEventArgs) {
    if (args.requestType === 'eventCreate') {
      let newData = <any> args.data[0];
      let month;
      if (newData.StartTime.getMonth() + 1 < 11) {
        month = '0' + (newData.StartTime.getMonth() + 1);
      } else {
        month = (newData.StartTime.getMonth() + 1);
      }
      let date;
      if (newData.StartTime.getDate() < 10) {
        date = '0' + newData.StartTime.getDate();
      } else {
        date = newData.StartTime.getDate();
      }
      let fullDate = newData.StartTime.getFullYear() + '-' + month + '-' + date;
      let startTime, startHour, startMinute;
      if (newData.StartTime.getHours() < 10) {
        startHour = '0' + newData.StartTime.getHours();
      } else {
        startHour = newData.StartTime.getHours();
      }
      if (newData.StartTime.getMinutes() < 10) {
        startMinute = '0' + newData.StartTime.getMinutes();
      } else {
        startMinute = newData.StartTime.getMinutes();
      }
      startTime = startHour + ':' + startMinute;
      let endTime, endHour, endMinute;
      if (newData.EndTime.getHours() < 10) {
        endHour = '0' + newData.EndTime.getHours();
      } else {
        endHour = newData.EndTime.getHours();
      }
      if (newData.EndTime.getMinutes() < 10) {
        endMinute = '0' + newData.EndTime.getMinutes();
      } else {
        endMinute = newData.EndTime.getMinutes();
      }
      endTime = endHour + ':' + endMinute;
      let subject = newData.Subject;
      return this.route.navigate(['dat-phong-hop/create', 1, 1, fullDate, fullDate, startTime, endTime, subject]);
    }
  }

  getCellContent(date: Date): string {
    if (this.scheduleView == 'Month') {
      if (date.getMonth() === 10 && date.getDate() === 23) {
        return '<img src="./assets/scheduler_images/anniversary.jpg"  alt=""/><div class="caption font-weight-bold text-danger" >Kỉ niệm ngày thành lập</div>';
      } else if
      (date.getMonth() === 8 && date.getDate() === 2) {
        return '<img src="./assets/scheduler_images/independence.jpg"  alt=""/><div class="caption h5 text-danger">Quốc Khánh</div>';
      } else if
      (date.getMonth() === 0 && date.getDate() === 1) {
        return '<img src="./assets/scheduler_images/newyear.jpg"  alt=""/><div class="caption font-weight-bold text-danger">New Year"s Day</div>';
      }
      return '';
    }
  }

  test(id: number, event) {
    if (!event.target.checked) {
      this.listId = this.listId.filter(item => item !== id);
    } else {
      this.listId.push(id);
    }
    console.log(this.listId);
    this.renderData();
  }

  oneventRendered(args: EventRenderedArgs): void {
    let categoryColor: string = args.data.CategoryColor as string;
    if (!args.element || !categoryColor) {
      return;
    }
    if (this.scheduleObj.currentView === 'Agenda') {
      (args.element.firstChild as HTMLElement).style.borderLeftColor = categoryColor;
    } else {
      args.element.style.backgroundColor = categoryColor;
    }
  }
}
