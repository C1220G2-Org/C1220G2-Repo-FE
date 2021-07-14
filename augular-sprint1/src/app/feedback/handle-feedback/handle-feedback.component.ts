import {Component, OnInit} from '@angular/core';
import {Feedback} from '../../models/feedback';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../../models/user';
import {FeedBackServiceService} from '../feed-back-service.service';
import {Subscription} from 'rxjs';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {HandleFeedback} from '../../models/handle-feedback';
import {MeetingRoom} from '../../models/meeting-room';
import {NgxSpinnerService} from 'ngx-bootstrap-spinner';

@Component({
  selector: 'app-handle-feedback',
  templateUrl: './handle-feedback.component.html',
  styleUrls: ['./handle-feedback.component.css']
})
export class HandleFeedbackComponent implements OnInit {
  feedback: Feedback;
  handleFeedback: HandleFeedback;
  handleFeedbackForm: FormGroup;
  userList: User[] = [];
  private subscription: Subscription;
  roomList: MeetingRoom[] = [];
  idFeedback: number;

  constructor(private feedbackService: FeedBackServiceService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private toastService: ToastrService,
              private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      this.idFeedback = parseInt(<any> paramMap.get('id'));
      this.subscription = this.feedbackService.getFeedbackById(this.idFeedback).subscribe(
        value => {
          this.feedback = value;
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
    this.handleFeedbackForm = new FormGroup({
      content: new FormControl('', [Validators.required, Validators.pattern('(.|\\s)*\\S(.|\\s)*'),
        Validators.minLength(5), Validators.maxLength(500)]),
      image: new FormControl(''),
      user: new FormControl('', [Validators.required])
    });
  }

  submit() {
    this.spinner.show();
    this.handleFeedback = this.handleFeedbackForm.value;
    this.handleFeedback.image = this.feedback.image;
    this.feedbackService.handleFeedback(this.handleFeedback, this.feedback.id).subscribe(
      value => {
        this.showSuccess();
      },
      error => {
      },
      () => {
        this.router.navigateByUrl('/phan-hoi/danh-sach-phan-hoi');
      }
    );
    setTimeout(() => {
      /** spinner ends after 15 seconds */
      this.spinner.hide();
    }, 5000);
  }

  get user() {
    return this.handleFeedbackForm.get('user');
  }

  get content() {
    return this.handleFeedbackForm.get('content');
  }

  showSuccess() {
    this.toastService.success('Thành công !', 'Đã xử lý');
  }

}
