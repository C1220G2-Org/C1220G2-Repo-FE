import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CreateUserComponent} from './create-user/create-user.component';
import {ListUserComponent} from './list-user/list-user.component';
import {ProfileComponent} from './profile/profile.component';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {EditUserComponent} from './edit-user/edit-user.component';
import {BookingHistoryComponent} from './booking-history/booking-history.component';
import {AuthGuard} from '../guards/auth.guard';


const routes: Routes = [
  {path: 'tao-moi', component: CreateUserComponent},
  {path: 'thong-tin/:id', component: ProfileComponent},
  {path: 'danh-sach', component: ListUserComponent},
  {path: 'cap-nhat/:id', component: EditUserComponent},
  {path: 'lich-su-dat-phong/:id', component: BookingHistoryComponent},
  {path: 'quan-ly-dat-phong', component: BookingHistoryComponent},
  {path: 'doi-mat-khau/:id', component: ChangePasswordComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {
}
