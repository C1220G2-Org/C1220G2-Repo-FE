import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ManagementStatisticsComponent} from './management-statistics/management-statistics.component';


const routes: Routes = [
  {
    path: '', component: ManagementStatisticsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatisticsRoutingModule {
}
