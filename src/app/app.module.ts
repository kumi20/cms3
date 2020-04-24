import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AppService } from './app.service';
import { HttpClientModule} from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';

import { AuthGuard } from './auth.guard';
import { EventService } from './event.service';
import { EditorModule } from '@tinymce/tinymce-angular';

import { DxButtonModule } from 'devextreme-angular';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LogOnComponent } from './log-on/log-on.component';

import { CmsModule } from './cms/cms.module';
import { NavigationComponent } from './cms/navigation/navigation.component';
import { DxDrawerComponent, DxDrawerModule, DxListModule, DxRadioGroupModule, DxToolbarModule } from 'devextreme-angular';

import { TemplateModule } from './template/template.module'
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LogOnComponent,
    NavigationComponent
  ],
  imports: [
    TemplateModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    EditorModule,
    ReactiveFormsModule,
    DxButtonModule,
    HttpClientModule,
    CmsModule,
    DxDrawerModule,
    DxListModule,
    DxRadioGroupModule,
    DxToolbarModule
  ],
  providers: [AppService, EventService, AuthGuard],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule { }
