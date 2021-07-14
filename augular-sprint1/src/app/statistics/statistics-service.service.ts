import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {StatisticDto} from '../models/statistic-dto';

@Injectable({
  providedIn: 'root'
})
export class StatisticsServiceService {

  private API_URL = 'http://localhost:8080/api/roombooking';

  constructor(private httpClient: HttpClient) {
  }

  getUserStatistic(startDate: string, endDate: string): Observable<StatisticDto[]> {
    console.log(startDate + endDate);
    return this.httpClient.get<StatisticDto[]>(this.API_URL + '/statistics' + '?startDate=' + startDate + '&endDate=' + endDate);
  }
}
