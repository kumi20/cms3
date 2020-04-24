import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { Router, CanActivate } from "@angular/router";

import { AppService } from "../app.service";
import { EventService } from "../event.service";
import { AgmCoreModule } from "@agm/core";
import { FullCalendarModule } from "ng-fullcalendar";

import { StaticComponent } from "./static/static.component";
import { NewsComponentView } from "./news/news.component";
import { MapyComponent } from "./mapy/mapy.component";
import { MenuParent } from "./menu/menu/menu.component";
import { ChildMenuComponent } from "./menu/child-menu/child-menu.component";

import { SafeHtmlPipe } from "./static/static.component";

import {
  DxDataGridModule,
  DxTextBoxModule,
  DxTagBoxModule,
  DxNumberBoxModule,
  DxSelectBoxModule,
  DxDateBoxModule,
  DxCheckBoxModule,
  DxRadioGroupModule,
  DxTooltipModule,
  DxTemplateModule,
  DxListModule,
  DxProgressBarModule,
  DxAutocompleteModule,
  DxFormModule,
  DxTabPanelModule,
  DxValidatorModule,
  DxButtonGroupModule,
  DxCalendarModule,
  DxButtonModule,
  DxPopupModule,
  DxDropDownBoxModule,
  DxTextAreaModule,
  DxRangeSliderModule,
  DxColorBoxModule,
  DxTabsModule,
  DxValidationSummaryModule,
  DxTreeViewModule,
  DxDrawerModule,
  DxToolbarModule,
  DxScrollViewModule,
  DxSortableModule,
  DxRangeSelectorModule,
  DxPopoverModule
} from "devextreme-angular";

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    DxDataGridModule,
    DxTextBoxModule,
    DxTagBoxModule,
    DxNumberBoxModule,
    DxSelectBoxModule,
    DxDateBoxModule,
    DxCheckBoxModule,
    DxRadioGroupModule,
    DxTooltipModule,
    DxTemplateModule,
    DxListModule,
    DxProgressBarModule,
    DxAutocompleteModule,
    DxFormModule,
    DxTabPanelModule,
    DxValidatorModule,
    DxButtonGroupModule,
    DxCalendarModule,
    DxButtonModule,
    DxPopupModule,
    DxDropDownBoxModule,
    DxTextAreaModule,
    DxRangeSliderModule,
    DxColorBoxModule,
    DxTabsModule,
    DxValidationSummaryModule,
    DxTreeViewModule,
    DxDrawerModule,
    DxToolbarModule,
    DxScrollViewModule,
    DxSortableModule,
    DxRangeSelectorModule,
    DxPopoverModule,
    AgmCoreModule.forRoot({
      // please get your own API key here:
      // https://developers.google.com/maps/documentation/javascript/get-api-key?hl=en
      apiKey: "AIzaSyCWGwAYym9aNgPYwihVhdaB-pxnoE03-D4"
    })
  ],
  declarations: [
    SafeHtmlPipe,
    StaticComponent,
    NewsComponentView,
    MapyComponent,
    MenuParent,
    ChildMenuComponent
  ],
  providers: [AppService, EventService],
  schemas: [NO_ERRORS_SCHEMA]
})
export class TemplateModule {}
