import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {NotificationUser} from '../../models/notification-user';
import SockJs from 'sockjs-client';
import {Stomp} from '@stomp/stompjs';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  API_URL: string = 'http://localhost:8080/api/notification/';
  constructor(private http: HttpClient) { }
  getAllNotification(id:number): Observable<NotificationUser[]> {
    return this.http.get<NotificationUser[]>(this.API_URL + 'list/'+id);
  }
  updateBackground(notification:NotificationUser): Observable<NotificationUser> {
    return this.http.put<NotificationUser>(this.API_URL + 'patchBackground',notification);
  }
  connect() {
    let socket = new SockJs('http://localhost:8080/api/socket');
    let stompClient = Stomp.over(socket);
    return stompClient;
  }
}
