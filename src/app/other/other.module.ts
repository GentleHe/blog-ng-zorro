import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FruitComponent } from './components';
import {SharedModule} from "../shared";
import {OtherRoutingModule} from "./other-routing.module";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";
import {NzDividerModule} from "ng-zorro-antd/divider";
import { TestComponent } from './components';
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import {FormsModule} from "@angular/forms";



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
    NzDropDownModule,
    FormsModule,
  ]
})
export class OtherModule { }
