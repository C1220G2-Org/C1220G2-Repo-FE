import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {StatisticsRoutingModule} from './statistics-routing.module';
import {ManagementStatisticsComponent} from './management-statistics/management-statistics.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import {ChartsModule} from 'ng2-charts';


@NgModule({
  declarations: [ManagementStatisticsComponent],
  exports: [
    ManagementStatisticsComponent
  ],
  imports: [
    CommonModule,
    StatisticsRoutingModule,
    FormsModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    ChartsModule
  ]
})
export class StatisticsModule {
}
