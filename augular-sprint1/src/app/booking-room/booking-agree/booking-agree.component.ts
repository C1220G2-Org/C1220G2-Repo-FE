import {Component, OnInit} from '@angular/core';
import {User} from '../../models/user';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {UserService} from '../../user/user.service';

@Component({
  selector: 'app-booking-agree',
  templateUrl: './booking-agree.component.html',
  styleUrls: ['./booking-agree.component.css']
})
export class BookingAgreeComponent implements OnInit {
  userId: any;
  user: User;
  startDateVariable: any = '';
  startHourVariable: any = '';
  endDateVariable: any = '';
  endHourVariable: any = '';
  meetingRoomName: any = '';

  constructor(private activatedRoute: ActivatedRoute, private userService: UserService, private route: Router) {
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      this.userId = parseInt(<any> paramMap.get('userId'));
      this.startDateVariable = <any> paramMap.get('startDateVariable');
      this.endDateVariable = <any> paramMap.get('endDateVariable');
      this.startHourVariable = <any> paramMap.get('startHourVariable');
      this.endHourVariable = <any> paramMap.get('endHourVariable');
      this.meetingRoomName = <any> paramMap.get('meetingRoomName');
      this.userService.findById(this.userId).subscribe(data => {
        this.user = data;
        console.log(this.user);
      });
    });
    // setTimeout(() => {
    //   this.route.navigateByUrl('dat-phong-hop/man-hinh');
    //   }, 5000);
  }
}
