import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzBreadCrumbModule} from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import {NzMenuModule} from "ng-zorro-antd/menu";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzTableModule} from "ng-zorro-antd/table";
import {BaseComponent, PageNotFoundComponent} from './components';
import {SharedRoutingModule} from "./shared.routing.module";
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzFormModule} from "ng-zorro-antd/form";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    PageNotFoundComponent,
    BaseComponent,
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    NzTableModule,
  ],
  exports: [
    NzLayoutModule,
    NzBreadCrumbModule,
    NzButtonModule,
    NzIconModule,
    NzMenuModule,
    NzTableModule,
    NzModalModule,
    NzFormModule,
    ReactiveFormsModule,
  ]
})
export class SharedModule { }
