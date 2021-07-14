import {BrowserModule} from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule} from '@angular/forms';
import {BookingRoomModule} from './booking-room/booking-room.module';
import {UserModule} from './user/user.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {SecurityModule} from './security/security.module';
import {SharedModule} from './shared/shared.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';
import {AngularFireModule} from '@angular/fire';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {environment} from '../environments/environment';
import {AuthenErrorPageComponent} from './authen-error-page/authen-error-page.component';
import {AuthInterceptor} from './helpers/auth.interceptor';
import {NgxSpinnerModule} from 'ngx-bootstrap-spinner';
import {StatisticsModule} from './statistics/statistics.module';

@NgModule({
  declarations: [
    AppComponent,
    AuthenErrorPageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    BookingRoomModule,
    UserModule,
    HttpClientModule,
    SecurityModule,
    SharedModule,
    NgbModule,
    NgxSpinnerModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    StatisticsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
