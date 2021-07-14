import { Component, OnInit } from '@angular/core';
import {FeedBackServiceService} from '../feed-back-service.service';
import {TokenStorageService} from '../../user/token-storage.service';
import {Feedback} from '../../models/feedback';
import {User} from '../../models/user';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-list-user-feedback',
  templateUrl: './list-user-feedback.component.html',
  styleUrls: ['./list-user-feedback.component.css']
})
export class ListUserFeedbackComponent implements OnInit {
  private roles: string[];
  isLoggedIn = false;
  showAdminBoard = false;
  showUserBoard = false;
  username: string;
  userId: number;
   listFeedback: Feedback[] = [];
   listUser: User[];
  private subscription: Subscription;
  page: number = 1;
  pageSize: number = 5;
  collectionSize: number;
  length:number;




  constructor( private feedbackServiceService: FeedBackServiceService,
               private tokenStorageService: TokenStorageService) {
    this.subscription = this.feedbackServiceService.getAllUser().subscribe(
      value => {
        this.listUser = value;
      }, error => {
        console.log(error);
      },
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
    this.getAll()
  }

  getAll(){
    console.log(this.userId);
    this.feedbackServiceService.searchUser(this.userId).subscribe(value=>{
      if(value == null){
        this.listFeedback =[];
        this.length=0;
      }else {
        this.listFeedback = value;
        this.length=this.listFeedback.length;
      }
      console.log(value);
      this.collectionSize = this.listFeedback.length;
    })

  }
}
