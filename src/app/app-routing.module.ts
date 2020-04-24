import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AuthGuard } from "./auth.guard";

import { DashboardComponent } from "./dashboard/dashboard.component";
import { LogOnComponent } from "./log-on/log-on.component";

//komponenty dla cms
import { NewsComponent } from "./cms/news/news.component";
import { AddNewsComponent } from "./cms/news/add-news/add-news.component";
import { StaticComponent } from "./cms/static/static.component";
import { AddStaticComponent } from "./cms/static/add-static/add-static.component";
import { GalleryComponent } from "./cms/gallery/gallery.component";
import { AddGalleryComponent } from "./cms/gallery/add-gallery/add-gallery.component";
import { PollComponent } from "./cms/poll/poll.component";
import { AddPollComponent } from "./cms/poll/add-poll/add-poll.component";
import { MapComponent } from "./cms/map/map.component";
import { AddMapComponent } from "./cms/map/add-map/add-map.component";
import { CformComponent } from "./cms/cform/cform.component";
import { CformAddComponent } from "./cms/cform/cform-add/cform-add.component";
import { NletterComponent } from "./cms/nletter/nletter.component";
import { AddNletterComponent } from './cms/nletter/add-nletter/add-nletter.component';
import { SettingsComponent } from './cms/settings/settings.component';
import { UserComponent } from './cms/user/user.component';
import { AddUserComponent } from './cms/user/add-user/add-user.component';
import { HelpComponent } from './cms/help/help.component';
import { CalendarComponent } from './cms/calendar/calendar.component';
import { MenuComponent } from './cms/menu/menu.component';
import { AddMenuComponent } from './cms/menu/add-menu/add-menu.component';
import { PageComponent } from './cms/page/page.component';
import { ContentComponent} from './cms/content/content.component';
 
const routes: Routes = [
  { path: "", component: LogOnComponent },
  {
    path: "content",
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "",
        outlet: "panel-outlet",
        component: ContentComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "news",
        outlet: "panel-outlet",
        component: NewsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "news-add",
        outlet: "panel-outlet",
        component: AddNewsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "news-add/:id",
        outlet: "panel-outlet",
        component: AddNewsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "static",
        outlet: "panel-outlet",
        component: StaticComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "static-add",
        outlet: "panel-outlet",
        component: AddStaticComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "static-add/:id",
        outlet: "panel-outlet",
        component: AddStaticComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "gallery",
        outlet: "panel-outlet",
        component: GalleryComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "gallery-add",
        outlet: "panel-outlet",
        component: AddGalleryComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "gallery-add/:id",
        outlet: "panel-outlet",
        component: AddGalleryComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "poll",
        outlet: "panel-outlet",
        component: PollComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "poll-add",
        outlet: "panel-outlet",
        component: AddPollComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "poll-add/:id",
        outlet: "panel-outlet",
        component: AddPollComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "map",
        outlet: "panel-outlet",
        component: MapComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "map-add",
        outlet: "panel-outlet",
        component: AddMapComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "map-add/:id",
        outlet: "panel-outlet",
        component: AddMapComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "cform",
        outlet: "panel-outlet",
        component: CformComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "cform-add",
        outlet: "panel-outlet",
        component: CformAddComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "cform-add/:id",
        outlet: "panel-outlet",
        component: CformAddComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "nletter",
        outlet: "panel-outlet",
        component: NletterComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "nletter-add",
        outlet: "panel-outlet",
        component: AddNletterComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "nletter-add/:id",
        outlet: "panel-outlet",
        component: AddNletterComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "settings",
        outlet: "panel-outlet",
        component: SettingsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "user",
        outlet: "panel-outlet",
        component: UserComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "user-add",
        outlet: "panel-outlet",
        component: AddUserComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "user-add/:id",
        outlet: "panel-outlet",
        component: AddUserComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "help",
        outlet: "panel-outlet",
        component: HelpComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "calendar",
        outlet: "panel-outlet",
        component: CalendarComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "menu",
        outlet: "panel-outlet",
        component: MenuComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "menu-add",
        outlet: "panel-outlet",
        component: AddMenuComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "menu-add/:id",
        outlet: "panel-outlet",
        component: AddMenuComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "page",
        outlet: "panel-outlet",
        component: PageComponent,
        canActivate: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      enableTracing: false,
      useHash: true
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
