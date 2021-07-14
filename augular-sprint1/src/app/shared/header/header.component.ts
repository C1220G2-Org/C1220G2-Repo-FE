import {Component, OnInit} from '@angular/core';
import {TokenStorageService} from '../../user/token-storage.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {NotificationUser} from '../../models/notification-user';
import {NotificationService} from './notification.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  private roles: string[];
  isLoggedIn = false;
  showAdminBoard = false;
  showUserBoard = false;
  username: string;
  userId: number;
  notificationList:NotificationUser[];
  listSize:number =  0;
  showNewNotification: boolean = false;
  listUserIdNotification:number[] =[];
  constructor(public afAuth: AngularFireAuth,
              private tokenStorageService: TokenStorageService,
              private router: Router,
              private toastService: ToastrService,
              private notificationService: NotificationService) {
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
    this.loadNotification();
  }
  logout(): void {
    this.tokenStorageService.signOut();
    // @ts-ignore
    window.location.assign('/');
  }
  signOut() {
    this.afAuth.signOut().then(() => {
      this.router.navigateByUrl('/');
    });
  }
  loadNotification(){
    this.notificationService.getAllNotification(this.userId).subscribe(
      value => {
        console.log(value);
        if (value == null){
          this.notificationList =[];
          this.listSize = 0;
        }else {
          this.notificationList = value;
          this.listSize = this.notificationList.length;
        };
        let stompClient = this.notificationService.connect();
        stompClient.connect({}, frame => {
          stompClient.subscribe('/topic/notification', notifications => {
            this.listUserIdNotification = JSON.parse(notifications.body).userId;
            for (let i:number = 0; i<this.listUserIdNotification.length;i++){
              if (this.listUserIdNotification[i] == this.userId){
                this.showNewNotification = true;
              }
            }
          })
        });
      }
    );
  }
  notSeen(){
    for (let notification of this.listUserIdNotification){
      console.log(notification['background']);
      if (notification['background'] == "blue"){
        this.showNewNotification = true;
        break;
      }
    }
  }
  view() {
    this.loadNotification();
    this.showNewNotification = false;
  }
  onSelect(notification:NotificationUser) {
    this.notificationService.updateBackground(notification).subscribe(
      value => {
        this.router.navigate(['/phan-hoi/chi-tiet',{id:notification.feedbackId,content:notification.content}],{ skipLocationChange: true });
      }
    );
  }
}
