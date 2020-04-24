import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';

import { AppRoutingModule } from '../app-routing.module';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FullCalendarModule } from '@fullcalendar/angular';
import { DragulaModule } from 'ng2-dragula';

import { DxDrawerComponent, 
  DxDrawerModule, 
  DxListModule, 
  DxRadioGroupModule, 
  DxToolbarModule, 
  DxDataGridModule, 
  DxTextBoxModule,
  DxNumberBoxModule, 
	DxSelectBoxModule,
	DxDateBoxModule, 
  DxCheckBoxModule,
  DxPopupModule, 
  DxTextAreaModule,
  DxFileUploaderModule,
  DxButtonModule} from 'devextreme-angular';
import { NewsComponent } from './news/news.component';
import { AddNewsComponent } from './news/add-news/add-news.component';
import { GroupNewsAddComponent } from './group-news-add/group-news-add.component';
import { StaticComponent } from './static/static.component';
import { AddStaticComponent } from './static/add-static/add-static.component';
import { GalleryComponent } from './gallery/gallery.component';
import { AddGalleryComponent } from './gallery/add-gallery/add-gallery.component';
import { PollComponent } from './poll/poll.component';
import { AddPollComponent } from './poll/add-poll/add-poll.component';
import { MapComponent } from './map/map.component';
import { AddMapComponent } from './map/add-map/add-map.component';
import { GroupMapAddComponent } from './group-map-add/group-map-add.component';
import { CformComponent } from './cform/cform.component';
import { CformAddComponent } from './cform/cform-add/cform-add.component';
import { UserCformAddComponent } from './user-cform-add/user-cform-add.component';
import { NletterComponent } from './nletter/nletter.component';
import { AddNletterComponent } from './nletter/add-nletter/add-nletter.component';
import { SettingsComponent } from './settings/settings.component';
import { UserComponent } from './user/user.component';
import { AddUserComponent } from './user/add-user/add-user.component';
import { HelpComponent } from './help/help.component';
import { CalendarComponent } from './calendar/calendar.component';
import { MenuComponent } from './menu/menu.component';
import { AddMenuComponent } from './menu/add-menu/add-menu.component';
import { PageComponent } from './page/page.component';
import { DynamicComponentComponent } from './dynamic-component/dynamic-component.component';
import { WraperComponentComponent } from './wraper-component/wraper-component.component';
import { ContainerComponent } from './page/container/container.component';

import { TemplateModule } from '../template/template.module';
import { MenuPageComponent } from './page/menu-page/menu-page.component';
import { ContentComponent } from './content/content.component';

@NgModule({
  declarations: [NewsComponent, 
    AddNewsComponent, 
    GroupNewsAddComponent,
    StaticComponent,
    AddStaticComponent,
    GalleryComponent,
    AddGalleryComponent,
    PollComponent,
    AddPollComponent,
    MapComponent,
    AddMapComponent,
    GroupMapAddComponent,
    CformComponent,
    CformAddComponent,
    UserCformAddComponent,
    NletterComponent,
    AddNletterComponent,
    SettingsComponent,
    UserComponent,
    AddUserComponent,
    HelpComponent,
    CalendarComponent,
    MenuComponent,
    AddMenuComponent,
    PageComponent,
    DynamicComponentComponent,
    WraperComponentComponent,
    ContainerComponent,
    MenuPageComponent,
    ContentComponent,    
    ],
  imports: [
    TemplateModule,
    FullCalendarModule,
    DragulaModule,
    CommonModule,
    BrowserModule,
    FormsModule,
    FileUploadModule,
    ReactiveFormsModule,
    EditorModule,
    DxDrawerModule,
    DxListModule,
    DxButtonModule,
    DxRadioGroupModule,
    DxTextAreaModule,
    DxToolbarModule,
    DxDataGridModule,
    AppRoutingModule,
    DxTextBoxModule,
    DxNumberBoxModule, 
    DxSelectBoxModule,
    DxDateBoxModule, 
    DxPopupModule,
    DxFileUploaderModule,
    DxCheckBoxModule,
    AgmCoreModule.forRoot({
      // https://developers.google.com/maps/documentation/javascript/get-api-key?hl=en#key
      apiKey: 'AIzaSyCWGwAYym9aNgPYwihVhdaB-pxnoE03-D4'
    }),
    
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class CmsModule { }
