import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeContainerComponent} from './home';
import {PageNotFoundComponent} from "./shared";

const routes: Routes = [
  {path:'', component: HomeContainerComponent, loadChildren: () => import('./home').then(m => m.HomeModule)},
  {path:'system', component:HomeContainerComponent, loadChildren: ()=>import('./system').then((m => m.SystemModule))},
  {path:'shared', component:HomeContainerComponent, loadChildren: ()=>import('./shared').then((m => m.SharedModule))},
  {path:'**', redirectTo: 'shared/404'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
