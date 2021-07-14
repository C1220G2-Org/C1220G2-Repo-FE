import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {BookingCancellation} from '../models/booking-cancellation';

const API_URL = `${environment.apiUrl}` + '/api/booking-cancellation';

@Injectable({
  providedIn: 'root'
})
export class BookingCancellationService {

  // API_URL: string = "http://localhost:8080/booking-cancellation";

  constructor(private http: HttpClient) {
  }

  saveBookingCancellation(bookingCancellation: BookingCancellation): Observable<BookingCancellation> {
    return this.http.post<BookingCancellation>(API_URL, bookingCancellation);
  }

  getBookingCancellationsOfUser(userId: number): Observable<BookingCancellation[]> {
    return this.http.get<BookingCancellation[]>(`${API_URL}/${userId}`);
  }

  deleteBookingCancellationByRoomIdAndUserId(roomId: number, userId: number): Observable<BookingCancellation> {
    return this.http.delete<BookingCancellation>(`${API_URL}/delete/${roomId}/${userId}`);
  }

}
