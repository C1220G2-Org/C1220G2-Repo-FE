import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable, throwError} from 'rxjs';
import {Property} from '../models/property';
import {catchError} from 'rxjs/operators';


const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class PropertyServiceService {

  constructor(private httpClient: HttpClient) {
  }

  getAll(): Observable<Property[]> {
    return this.httpClient.get<Property[]>(API_URL + '/api/properties/').pipe(catchError(this.handleError));
  }

  searchProperty(search: string): Observable<Property[]> {
    return this.httpClient.get<Property[]>(API_URL + '/api/properties/search?search=' + search).pipe(catchError(this.handleError));
  }

  saveProperty(property: Property): Observable<Property> {
    return this.httpClient.post<Property>(API_URL + '/api/properties', property).pipe(catchError(this.handleError));
  }

  findById(id: number): Observable<Property> {
    return this.httpClient.get<Property>(`${API_URL}/api/properties/${id}`).pipe(catchError(this.handleError));
  }

  updateProperty(id: number, property: Property): Observable<Property> {
    return this.httpClient.put<Property>(`${API_URL}/api/properties/${id}`, property).pipe(catchError(this.handleError));
  }

  deleteProperty(id: number): Observable<Property> {
    return this.httpClient.delete<Property>(`${API_URL}/api/properties/${id}`).pipe(catchError(this.handleError));
  }

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
