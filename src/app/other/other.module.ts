import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FruitComponent } from './components';
import {SharedModule} from "../shared";
import {OtherRoutingModule} from "./other-routing.module";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";
import {NzDividerModule} from "ng-zorro-antd/divider";
import { TestComponent } from './components';



@NgModule({
  declarations: [
    FruitComponent,
    TestComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    OtherRoutingModule,
    NzInputModule,
    NzDatePickerModule,
    NzDividerModule,
  ]
})
export class OtherModule { }
