import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeedbackRoutingModule } from './feedback-routing.module';
import { CreateFeedbackComponent } from './create-feedback/create-feedback.component';
import { ListFeedbackComponent } from './list-feedback/list-feedback.component';
import { HandleFeedbackComponent } from './handle-feedback/handle-feedback.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import { CreateFeedbackTechnicalComponent } from './create-feedback-technical/create-feedback-technical.component';
import { FormatContentPipe } from './format-content.pipe';
import {ListUserFeedbackComponent} from './list-user-feedback/list-user-feedback.component';
import { DetailFeedbackComponent } from './detail-feedback/detail-feedback.component';
import {NgxSpinnerModule} from 'ngx-bootstrap-spinner';


@NgModule({
  declarations: [
    CreateFeedbackComponent,
    ListFeedbackComponent,
    HandleFeedbackComponent,
    CreateFeedbackTechnicalComponent,
    FormatContentPipe,
    ListUserFeedbackComponent,
    DetailFeedbackComponent],
  exports: [
    FormatContentPipe
  ],
  imports: [
    CommonModule,
    FeedbackRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    NgbPaginationModule,
    NgxSpinnerModule,

  ]
})
export class FeedbackModule { }
