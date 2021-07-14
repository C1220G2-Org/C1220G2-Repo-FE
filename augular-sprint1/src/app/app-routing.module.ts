import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthGuard} from './guards/auth.guard';
import {AuthenErrorPageComponent} from './authen-error-page/authen-error-page.component';


const routes: Routes = [
  {
    path: 'gioi-thieu',
    loadChildren: () => import('./homepage/homepage.module').then(module => module.HomepageModule)
  },
  {
    path: 'dat-phong-hop',
    loadChildren: () => import('./booking-room/booking-room.module').then(module => module.BookingRoomModule)
  },
  {
    path: 'phan-hoi',
    loadChildren: () => import('./feedback/feedback.module').then(module => module.FeedbackModule)
  },
  {
    path: 'phong-hop',
    loadChildren: () => import('./meeting-room/meeting-room.module').then(module => module.MeetingRoomModule)
  },
  {
    path: 'tai-san',
    loadChildren: () => import('./property/property.module').then(module => module.PropertyModule)
  },
  {
    path: 'dang-nhap',
    loadChildren: () => import('./security/security.module').then(module => module.SecurityModule)
  },
  // {
  //   path: 'statistics',
  //   loadChildren: () => import('./statistics/statistics.module').then(module => module.StatisticsModule)
  // },
  {
    path: 'thong-ke',
    loadChildren: () => import('./statistics/statistics.module').then(module => module.StatisticsModule)
  },
  {
    path: 'nguoi-dung',
    loadChildren: () => import('./user/user.module').then(module => module.UserModule)
  },
  {
    path: '403', component: AuthenErrorPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
