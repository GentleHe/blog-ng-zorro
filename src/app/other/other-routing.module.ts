import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {FruitComponent, TestComponent} from "./components";

export const routes:Routes = [{
  path:'fruit', component: FruitComponent},{
  path:'test', component: TestComponent
}]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OtherRoutingModule{

}
