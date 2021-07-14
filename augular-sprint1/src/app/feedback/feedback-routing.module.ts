import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CreateFeedbackComponent} from './create-feedback/create-feedback.component';
import {ListFeedbackComponent} from './list-feedback/list-feedback.component';
import {HandleFeedbackComponent} from './handle-feedback/handle-feedback.component';
import {CreateFeedbackTechnicalComponent} from './create-feedback-technical/create-feedback-technical.component';
import {ListUserFeedbackComponent} from './list-user-feedback/list-user-feedback.component';
import {DetailFeedbackComponent} from './detail-feedback/detail-feedback.component';


const routes: Routes = [
  {path: 'them-moi-phan-hoi-phong-hop', component: CreateFeedbackComponent},
  {path: 'danh-sach-phan-hoi', component: ListFeedbackComponent},
  {path: 'xu-ly-phan-hoi/:id', component: HandleFeedbackComponent},
  {path: 'chi-tiet', component: DetailFeedbackComponent},
  {path: 'them-moi-phan-hoi-loi-ki-thuat', component: CreateFeedbackTechnicalComponent},
  {path: 'danh-sach-phan-hoi-nguoi-dung',component:ListUserFeedbackComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeedbackRoutingModule { }
