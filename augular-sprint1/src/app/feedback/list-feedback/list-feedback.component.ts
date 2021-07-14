import {Component, OnInit} from '@angular/core';
import {Feedback} from '../../models/feedback';
import {Subscription} from 'rxjs';
import {FeedBackServiceService} from '../feed-back-service.service';
import {User} from '../../models/user';
import {TokenStorageService} from '../../user/token-storage.service';
import {MeetingRoom} from '../../models/meeting-room';

@Component({
  selector: 'app-list-feedback',
  templateUrl: './list-feedback.component.html',
  styleUrls: ['./list-feedback.component.css']
})
export class ListFeedbackComponent implements OnInit {

  page: number = 1;
  pageSize: number = 5;
  collectionSize: number;
  listFeedback: Feedback[] = [];
  subscription: Subscription;
  userList: User[] = [];
  roomList: MeetingRoom[] = [];
  idDelete:number;
  feedbackDelete:Feedback;
  feedbackDeleteTitle:string;

  constructor(private feedbackService: FeedBackServiceService,
              private tokenStorageService: TokenStorageService) {
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
      },
    );
  }

  ngOnInit(): void {
    this.loadList();
  }

  loadList() {
    this.subscription = this.feedbackService.getAll().subscribe(
      value => {
        if (value == null) {
          this.listFeedback = [];
          this.collectionSize = 0;
        } else {
          this.listFeedback = value['content'];
          this.collectionSize = this.listFeedback.length;
      }
        }, error => {
        console.log(error);
      },()=>{
      }
    );
  }

  search(keyWord: string, status: string) {
    this.feedbackService.search(keyWord, status).subscribe(
      value => {
        if (value == null) {
          this.listFeedback = [];
          this.collectionSize = 0;
        } else {
          this.listFeedback = value;
          this.collectionSize = this.listFeedback.length;
        }
      },
      error => {

      },()=>{

      }
    );
  }

  sendIdToComponent(id: number) {
    this.idDelete = id;
    this.feedbackService.getFeedbackById(id).subscribe(data => {
      this.feedbackDelete = data;
      this.feedbackDeleteTitle = data.feedbackTitle;
    });
  }

  deleteUser() {
    this.feedbackService.deleteFeedback(this.idDelete).subscribe(
      value => {
        this.loadList();
      },
      error => {

      },()=>{
      }
    )
  }
}
