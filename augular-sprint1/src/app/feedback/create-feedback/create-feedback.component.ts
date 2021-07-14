import {Component, OnInit} from '@angular/core';
import {Feedback} from '../../models/feedback';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MeetingRoom} from '../../models/meeting-room';
import {FeedBackServiceService} from '../feed-back-service.service';
import {Subscription} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {TokenStorageService} from '../../user/token-storage.service';

@Component({
  selector: 'app-create-feedback',
  templateUrl: './create-feedback.component.html',
  styleUrls: ['./create-feedback.component.css']
})
export class CreateFeedbackComponent implements OnInit {

  newFeedback: Feedback;
  feedbackForm: FormGroup;
  meetingList: MeetingRoom[] = [];
  subscription: Subscription;
  private roles: string[];
  isLoggedIn = false;
  showAdminBoard = false;
  showUserBoard = false;
  username: string;
  userId: number;

  constructor(private feedbackService: FeedBackServiceService,
              private toastService: ToastrService,
              private router: Router,
              private tokenStorageService: TokenStorageService
  ) {
    this.subscription = this.feedbackService.getAllRoom().subscribe(
      value => {
        this.meetingList = value;
      }, error => {
        console.log(error);
      }
    );
  }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showUserBoard = this.roles.includes('ROLE_USER');

      this.username = user.username;
      this.userId = user.id;
    }
    this.feedbackForm = new FormGroup({
      feedbackTitle: new FormControl('', [Validators.required, Validators.pattern('(.|\\s)*\\S(.|\\s)*'),
        Validators.minLength(5),Validators.maxLength(20)]),
      feedbackTime: new FormControl(''),
      feedbackContent: new FormControl('', [Validators.required, Validators.pattern('(.|\\s)*\\S(.|\\s)*'),
        Validators.minLength(5),Validators.maxLength(500)]),
      image: new FormControl(null),
      typeError: new FormControl(null),
      userFeedback: new FormControl(this.userId),
      status: new FormControl(false),
      feedbackType: new FormControl(1),
      handleFeedback: new FormControl(null),
      meetingRoom: new FormControl('', [Validators.required])
    });
  }

  submit() {
    this.newFeedback = this.feedbackForm.value;
  }

  get feedbackTitle() {
    return this.feedbackForm.get('feedbackTitle');
  }

  get meetingRoom() {
    return this.feedbackForm.get('meetingRoom');
  }

  get feedbackContent() {
    return this.feedbackForm.get('feedbackContent');
  }

  addFeedback() {
    console.log(this.newFeedback);
    this.feedbackService.add(this.newFeedback).subscribe(
      value => {
        this.showSuccess();
        this.router.navigateByUrl('/dat-phong-hop/man-hinh');
      },
      error => {
      }
    );
  }

  showSuccess() {
    this.toastService.success('Thành công !', 'Đã gửi phản hồi');
  }
}
