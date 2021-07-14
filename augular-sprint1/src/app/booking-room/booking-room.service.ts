import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MeetingRoom} from '../models/meeting-room';
import {Observable} from 'rxjs';
import {MeetingType} from '../models/meeting-type';
import {BookingRoom} from '../models/booking-room';
import {CountBookingsPerMonth} from '../models/CountBookingsPerMonth';
import {RoomBooking} from '../models/room-booking';

const API_URL = 'http://localhost:8080/api/roombooking';

@Injectable({
  providedIn: 'root'
})
export class BookingRoomService {
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      // Authorization: 'my-auth-token'
    }),
  };

  constructor(private httpClient: HttpClient) {
  }

  public getMeetingRoom(): Observable<MeetingRoom[]> {
    return this.httpClient.get<MeetingRoom[]>(API_URL + '/ListMeetingRoom', this.httpOptions);
  }

  public getMeetingType(): Observable<MeetingType[]> {
    return this.httpClient.get<MeetingType[]>(API_URL + '/ListMeetingType', this.httpOptions);
  }

  public getListBookingRoom(): Observable<BookingRoom[]> {
    return this.httpClient.get<BookingRoom[]>(API_URL + '/ListBookingRoom', this.httpOptions);
  }

  public postBookingRoom(bookingAdd: any): Observable<any> {
    return this.httpClient.post<any>(API_URL + '/postBookingRoom', bookingAdd, this.httpOptions);
  }

  public postBookingRoomArray(bookingAdd: any[]): Observable<any[]> {
    return this.httpClient.post<any[]>(API_URL + '/postBookingRoomArray', bookingAdd, this.httpOptions);
  }

  public postBookingRoomPending(bookingAdd: any[]): Observable<any[]> {
    return this.httpClient.post<any[]>(API_URL + '/postBookingRoomPending', bookingAdd, this.httpOptions);
  }


  public findBookingRoomById(id: number): Observable<BookingRoom[]> {
    return this.httpClient.get<BookingRoom[]>(`${API_URL}/findBookingRoomById/${id}`, this.httpOptions);
  }

  public findByCountBookingsPerMonth(id: number, monthYear: string): Observable<CountBookingsPerMonth> {
    return this.httpClient.get<CountBookingsPerMonth>(`${API_URL}/CountBookingsPerMonth?userId=${id}&monthYear=${monthYear}`);
  }

  public searchEmpty(meetingRoomId: any, meetingTypeId: any, startDateVariable: string, endDateVariable: string,
                     startHourVariable: string, endHourVariable: string, capacity: any): Observable<any[]> {
    console.log(API_URL + '/searchEmpty?meetingRoomId=' + meetingRoomId + '&meetingTypeId=' + meetingTypeId +
      '&startDateVariable=' + startDateVariable + '&endDateVariable=' + endDateVariable +
      '&startHourVariable=' + startHourVariable + '&endHourVariable=' + endHourVariable + '&capacity=' + capacity);
    return this.httpClient.get<any[]>(API_URL + '/searchEmpty?meetingRoomId=' + meetingRoomId + '&meetingTypeId=' + meetingTypeId +
      '&startDateVariable=' + startDateVariable + '&endDateVariable=' + endDateVariable +
      '&startHourVariable=' + startHourVariable + '&endHourVariable=' + endHourVariable + '&capacity=' + capacity, this.httpOptions);
  }

  public saveCount(countBookingsPerMonth: any): Observable<any> {
    return this.httpClient.post<any>(API_URL + '/saveCount', countBookingsPerMonth, this.httpOptions);
  }

  public putCount(countBookingsPerMonth: any): Observable<any> {
    return this.httpClient.put<any>(`${API_URL}/saveCount/${countBookingsPerMonth.id}`, countBookingsPerMonth);
  }

  public callAdmin(id: number, code: string, startDateVariable: string, endDateVariable: string, startHourVariable: string, endHourVariable: string, meetingRoomName: any): Observable<CountBookingsPerMonth> {
    return this.httpClient.get<CountBookingsPerMonth>(`${API_URL}/sendHtmlEmail?userId=${id}&code=${code}&startDateVariable=${startDateVariable}
    &endDateVariable=${endDateVariable}&startHourVariable=${startHourVariable}&endHourVariable=${endHourVariable}&meetingRoomName=${meetingRoomName}`);
  }

  public findAll(idMeetingRoom: number[]): Observable<RoomBooking[]> {
    return this.httpClient.get<RoomBooking[]>(API_URL + '/' + idMeetingRoom, this.httpOptions);
  }
}
