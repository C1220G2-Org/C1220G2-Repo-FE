import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Department} from '../models/department';

const API_URL = `${environment.apiUrl}` + '/api/user';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<Department[]> {
    return this.http.get<Department[]>(API_URL + '/department-list');
  }
}
