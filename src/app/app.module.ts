import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule, routesModules } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainComponent } from './Components/main/main.component';
import { FormsModule } from '@angular/forms';
import { MainNavComponent } from './Components/main-nav/main-nav.component';
import { FactorsEditComponent } from './Components/factors-edit/factors-edit.component';
import { AddValuesComponent } from './Components/add-values/add-values.component';
import { ChartViewComponent } from './Components/chart-view/chart-view.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    routesModules,
    MainNavComponent,
    FactorsEditComponent,
    AddValuesComponent,
    ChartViewComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
