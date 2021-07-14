import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {User} from '../models/user';
import {UserDto} from '../models/user-dto';
import {UserPassword} from '../models/user-password';
import {UserBooking} from '../models/user-booking';
import {catchError} from 'rxjs/operators';

const API_URL = `${environment.apiUrl}` + '/api/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  getAllUser(): Observable<User[]> {
    return this.http.get<User[]>(API_URL + '/user-list').pipe(catchError(this.handleError));
  }

  saveUser(user): Observable<UserDto> {
    return this.http.post<UserDto>(API_URL + '/user-save', user).pipe(catchError(this.handleError));
  }

  searchUser(searchKeyword: string): Observable<any[]> {
    return this.http.get<any[]>(API_URL + '/user-search?keyword=' + searchKeyword).pipe(catchError(this.handleError));
  }

  findById(id: number): Observable<User> {
    return this.http.get<User>(`${API_URL}/get-user/${id}`).pipe(catchError(this.handleError));
  }

  deleteUser(id: number): Observable<User> {
    return this.http.delete<User>(`${API_URL}/user-delete/${id}`).pipe(catchError(this.handleError));
  }

  updateUser(id: number, user: UserDto): Observable<UserDto> {
    return this.http.patch<UserDto>(`${API_URL}/user-update/${id}`, user).pipe(catchError(this.handleError));
  }

  updateUserAvatar(id: number, avatar: string): Observable<UserDto> {
    return this.http.patch<UserDto>(`${API_URL}/user-update-avatar/${id}`, avatar).pipe(catchError(this.handleError));
  }

  changePassword(id: number, userPassword: UserPassword): Observable<void> {
    return this.http.patch<void>(`${API_URL}/user-change-password/${id}`, userPassword).pipe(catchError(this.handleError));
  }

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      // Authorization: 'my-auth-token'
    }),
  };

  // khahq's code
  getUserBookingHistory(userId: number): Observable<UserBooking[]> {
    return this.http.get<UserBooking[]>(`${API_URL}/booking-history/${userId}`).pipe(catchError(this.handleError));
  }

  getBookingsOfAllUsers(): Observable<UserBooking[]> {
    return this.http.get<UserBooking[]>(API_URL + '/bookings-all-users').pipe(catchError(this.handleError));
  }

  searchUserBookingHistory(userId: number, roomName: string, startDate: string, endDate: String,
                           status: string, meetingType: string, registrationDate: string): Observable<UserBooking[]> {
    return this.http.get<UserBooking[]>(API_URL + '/search-booking-history?userId=' + userId +
      '&roomName=' + roomName + '&startDate=' + startDate + '&endDate=' + endDate +
      '&status=' + status + '&meetingType=' + meetingType + '&registrationDate=' + registrationDate
      , this.httpOptions).pipe(catchError(this.handleError));
  }

  searchBookingHistoryOnAdmin(userId: number, roomName: string, startDate: string, endDate: String,
                              status: string, meetingType: string, registrationDate: string): Observable<UserBooking[]> {
    return this.http.get<UserBooking[]>(API_URL + '/search-booking-admin?userId=' + userId +
      '&roomName=' + roomName + '&startDate=' + startDate + '&endDate=' + endDate +
      '&status=' + status + '&meetingType=' + meetingType + '&registrationDate=' + registrationDate
      , this.httpOptions).pipe(catchError(this.handleError));
  }

  // ---------------------------------------------------------------------------------
  // sangld code
  private handleError(httpError: HttpErrorResponse) {
    let message = '';
    if (httpError.error instanceof ProgressEvent) {
      console.log('in progrss event');
      message = 'lỗi mạng';
    } else {
      message = JSON.parse(httpError.error).message;
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `lỗi server ${httpError.status}, ` +
        `body was: ${httpError.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Bạn không đủ quyền để truy cập vào trang này ' + message);
  }
}
