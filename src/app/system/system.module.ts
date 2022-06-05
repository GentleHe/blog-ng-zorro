import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent, UserFormComponent } from './components';
import {SystemRoutingModule} from "./system-routing.module";
import {SharedModule} from "../shared";




@NgModule({
  declarations: [
    UserComponent,
    UserFormComponent
  ],
  imports: [
    CommonModule,
    SystemRoutingModule,
    SharedModule
  ],
})
export class SystemModule { }
