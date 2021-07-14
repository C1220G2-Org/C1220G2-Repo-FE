import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedRoutingModule} from './shared-routing.module';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {FeedbackModule} from '../feedback/feedback.module';


@NgModule({
  declarations: [HeaderComponent, FooterComponent, NotFoundComponent],
  exports: [
    HeaderComponent,
    FooterComponent
  ],
    imports: [
        CommonModule,
        SharedRoutingModule,
        FeedbackModule
    ]
})
export class SharedModule {
}
