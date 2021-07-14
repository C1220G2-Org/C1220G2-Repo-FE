import {Injectable} from '@angular/core';
import {Feedback} from '../models/feedback';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {MeetingRoom} from '../models/meeting-room';
import {User} from '../models/user';
import {HandleFeedback} from '../models/handle-feedback';
import {TypeError} from '../models/type-error';
import {FeedbackTechnical} from '../models/feedback-technical';

@Injectable({
  providedIn: 'root'
})
export class FeedBackServiceService {
  API_URL: string = 'http://localhost:8080/api/feedback/';

  constructor(private http: HttpClient) {
  }

  getAllRoom(): Observable<MeetingRoom[]> {
    return this.http.get<MeetingRoom[]>(this.API_URL + 'meeting-dto-list');
  }

  getAllUser(): Observable<User[]> {
    return this.http.get<User[]>(this.API_URL + 'user-dto-list');
  }

  getAll(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(this.API_URL + 'list');
  }

  getFeedbackById(id: number): Observable<Feedback> {
    return this.http.get<Feedback>(this.API_URL + id);
  }

  add(newFeedback: Feedback): Observable<Feedback> {
    console.log(this.API_URL + 'create');
    console.log(newFeedback);
    return this.http.post<Feedback>(this.API_URL + 'create', newFeedback);
  }

  handleFeedback(newHandleFeedback: HandleFeedback, id: number): Observable<HandleFeedback> {
    return this.http.post<HandleFeedback>(this.API_URL + 'handle-feedback/' + id, newHandleFeedback);
  }

  search(keyWord:string, status: string): Observable<Feedback[]> {
    let urlSearch = '';
    urlSearch += 'keyWord=' + keyWord;
    urlSearch +='&' + 'status=' + status;
    console.log(this.API_URL + '?' + urlSearch);
    return this.http.get<Feedback[]>(this.API_URL + 'search?' + urlSearch);
  }

  deleteFeedback(id: number): Observable<Feedback>{
    console.log(this.API_URL+'delete/'+id);
    return this.http.delete<Feedback>(this.API_URL+'delete/'+id);
  }

  getAllFBType(): Observable<TypeError[]> {
    return this.http.get<TypeError[]>(this.API_URL + 'list/type');
  }

  searchUser(userName: any): Observable<Feedback[]>{
    return this.http.get<Feedback[]>(this.API_URL+'searchUser?userId='+userName)
  }

  save(feedbackTechnical): Observable<FeedbackTechnical> {
    return this.http.post<FeedbackTechnical>(this.API_URL + 'create/technical', feedbackTechnical);
  }
}
