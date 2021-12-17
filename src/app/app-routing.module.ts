import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddValuesComponent } from './Components/add-values/add-values.component';
import { ChartViewComponent } from './Components/chart-view/chart-view.component';
import { FactorsEditComponent } from './Components/factors-edit/factors-edit.component';
import { LoginComponent } from './Components/login/login.component';
import { MainComponent } from './Components/main/main.component';

const routes: Routes = [
  {path:'main', component:MainComponent, children:[
    {
      path:"chartView",
      component:ChartViewComponent
    },
    {
      path:"factorsEdit",
      component:FactorsEditComponent
    },
    {
      path:"addValues",
      component:AddValuesComponent
    }
  ]},
  {path:'', component:LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routesModules = [LoginComponent,MainComponent];