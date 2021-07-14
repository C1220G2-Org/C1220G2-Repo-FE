import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {MeetingRoom} from '../models/meeting-room';
import {PropertyDto} from '../models/property-dto';

@Injectable({
  providedIn: 'root'
})
export class MeetingRoomServiceService {

  meetingRoomList = [
    {}
  ];
  URL: string = 'http://localhost:8080/api/meetingRoom';

  constructor(private http: HttpClient) {

  }

  findAll(): Observable<MeetingRoom[]> {
    return this.http.get<MeetingRoom[]>(this.URL);
  }

  findSearch(keyword: string): Observable<MeetingRoom[]> {
    return this.http.get<MeetingRoom[]>(this.URL + '/' + 'search' + '?' + 'keyword=' + keyword);
  }

  edit(meetingRoom: MeetingRoom): Observable<void> {
    return this.http.put<void>(this.URL + '/' + meetingRoom.id, meetingRoom);
  }

  editProperties(properties: PropertyDto[]): Observable<void> {
    return this.http.put<void>(this.URL + '/propertiesEdit', properties);
  }

  findById(id: number): Observable<MeetingRoom> {
    return this.http.get<MeetingRoom>(this.URL + '/detail/' + id);
  }

  findListPropertyDto(namePropertyForSearch: string): Observable<PropertyDto[]> {
    return this.http.get<PropertyDto[]>(this.URL + '/properties?' + 'name=' + namePropertyForSearch);
  }

  deleteById(id: number): Observable<void> {
    return this.http.delete<void>(this.URL + '/' + id);
  }

  saveMeetingRoom(meetingRoom: MeetingRoom): Observable<MeetingRoom> {
    return this.http.post<MeetingRoom>(this.URL + '/add-new', meetingRoom);
  }
}
