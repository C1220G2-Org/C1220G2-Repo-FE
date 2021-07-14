import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PropertyRoutingModule} from './property-routing.module';
import {CreatePropertyComponent} from './create-property/create-property.component';
import {EditPropertyComponent} from './edit-property/edit-property.component';
import {ListPropertyComponent} from './list-property/list-property.component';
import {DetailPropertyComponent} from './detail-property/detail-property.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {NgxSpinnerModule} from 'ngx-bootstrap-spinner';


@NgModule({
  declarations: [CreatePropertyComponent, EditPropertyComponent, ListPropertyComponent, DetailPropertyComponent],
  exports: [
    ListPropertyComponent
  ],
  imports: [
    CommonModule,
    PropertyRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    NgxSpinnerModule
  ]
})
export class PropertyModule {
}
