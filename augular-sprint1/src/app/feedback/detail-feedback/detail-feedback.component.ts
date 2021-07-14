import { Component, OnInit } from '@angular/core';
import {Feedback} from '../../models/feedback';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {FeedBackServiceService} from '../feed-back-service.service';
import {Subscription} from 'rxjs';
import {User} from '../../models/user';
import {MeetingRoom} from '../../models/meeting-room';

@Component({
  selector: 'app-detail-feedback',
  templateUrl: './detail-feedback.component.html',
  styleUrls: ['./detail-feedback.component.css']
})
export class DetailFeedbackComponent implements OnInit {
  feedback:Feedback;
  idFeedback:number;
  notificationContent: string;
  subscription:Subscription;
  userList: User[] = [];
  roomList: MeetingRoom[] = [];

  constructor(private feedbackService: FeedBackServiceService,
              private activatedRoute: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      this.idFeedback = parseInt(<any>paramMap.get('id'));
      this.notificationContent = paramMap.get('content');
      this.subscription=this.feedbackService.getFeedbackById(this.idFeedback).subscribe(
        value => {
          this.feedback = value;
          console.log(this.feedback)
        }, error => {
          console.log(error);
        }
      );
    });

    this.subscription = this.feedbackService.getAllUser().subscribe(
      value => {
        this.userList = value;
      }, error => {
        console.log(error);
      },
    );
    this.subscription = this.feedbackService.getAllRoom().subscribe(
      value => {
        this.roomList = value;
      }, error => {
        console.log(error);
      }
    );
  }
  ok() {
    this.router.navigateByUrl('/dat-phong-hop/man-hinh');
  }
}
