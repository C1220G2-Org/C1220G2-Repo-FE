import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ListPropertyComponent} from './list-property/list-property.component';
import {EditPropertyComponent} from './edit-property/edit-property.component';
import {CreatePropertyComponent} from './create-property/create-property.component';
import {DetailPropertyComponent} from './detail-property/detail-property.component';


const routes: Routes = [
  {
    path: 'danh-sach',
    component: ListPropertyComponent
  },
  {
    path: 'chinh-sua/:id',
    component: EditPropertyComponent
  },
  {
    path: 'tao-moi',
    component: CreatePropertyComponent
  },
  {
    path: 'chi-tiet/:id',
    component: DetailPropertyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PropertyRoutingModule {
}
