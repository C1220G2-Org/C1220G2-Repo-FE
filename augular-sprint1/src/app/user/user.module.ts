import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UserRoutingModule} from './user-routing.module';
import {CreateUserComponent} from './create-user/create-user.component';
import {EditUserComponent} from './edit-user/edit-user.component';
import {ListUserComponent} from './list-user/list-user.component';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {ProfileComponent} from './profile/profile.component';
import {BookingHistoryComponent} from './booking-history/booking-history.component';
import {DatePickerModule, DateRangePickerModule} from '@syncfusion/ej2-angular-calendars';
import {NgxSpinnerModule} from 'ngx-bootstrap-spinner';


@NgModule({
  declarations: [
    CreateUserComponent,
    EditUserComponent,
    ListUserComponent,
    ChangePasswordComponent,
    ProfileComponent,
    BookingHistoryComponent
  ],
  exports: [
    CreateUserComponent,
    EditUserComponent,
    ListUserComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    DateRangePickerModule,
    DatePickerModule,
    NgxSpinnerModule
  ]
})
export class UserModule {
}
