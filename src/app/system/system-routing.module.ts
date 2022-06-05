import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {UserComponent} from "./components";

const routes: Routes = [
  {path: 'user', component: UserComponent}
]

@NgModule({
  imports:[RouterModule.forChild(routes)],
  exports:[RouterModule]
})
export class SystemRoutingModule{

}
