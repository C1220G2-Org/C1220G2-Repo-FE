import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {StatisticsServiceService} from '../statistics-service.service';

// @ts-ignore
import {ToastrService} from 'ngx-toastr';
import {StatisticDto} from '../../models/statistic-dto';

@Component({
  selector: 'app-management-statistics',
  templateUrl: './management-statistics.component.html',
  styleUrls: ['./management-statistics.component.css']
})
export class ManagementStatisticsComponent implements OnInit {

  public endDate = '';
  public startDate = '';


  constructor(private statisticsService: StatisticsServiceService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private toast: ToastrService,
  ) {
  }

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels = [];
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartData = [
    // {data: [65, 59, 80, 81, 56, 55, 40], label: 'Số lần đặt phòng: '}
    {data: [], label: 'Số lần đặt phòng: '}
  ];
  page: 1;
  statistics: StatisticDto[] = [];

  ngOnInit(): void {
    this.barChartData = [{data: [], label: 'Số lần đặt phòng: '}];
  }

  onSubmit() {
    if (this.endDate < this.startDate) {
      this.toast.error('Ngày kết thúc không được để trống');
      // tslint:disable-next-line:triple-equals
    } else if (this.startDate == this.endDate) {
      this.toast.error('Ngày bắt đầu và  ngày kết thúc không được trùng nhau');
    } else {
      this.toast.success();
    }
    this.statisticsService.getUserStatistic(this.startDate, this.endDate).subscribe(response => {
      this.statistics = response['content'];
      const successful = {data: [], label: 'số lần đặt phòng'};
      for (const item of this.statistics) {
        // @ts-ignore
        this.barChartLabels.push(item.name);
        this.barChartData[0].data.push(item.count);
        // console.log(this.barChartData[0]);
        successful.data.push(item.name);
      }
    }, error => {
    });
  }
}
