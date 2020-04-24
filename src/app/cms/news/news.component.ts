import {
  Component,
  OnInit,
  ViewChild,
  Renderer2,
  ElementRef
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AppService } from "../../app.service";
import { EventService } from "../../event.service";

@Component({
  selector: "app-news",
  templateUrl: "./news.component.html",
  styleUrls: ["./news.component.scss"]
})
export class NewsComponent implements OnInit {
  @ViewChild("divMessages", { static: false, read: ElementRef })
  private divMessages: ElementRef;
  newsList: News[];
  constructor(
    private CmsService: AppService,
    private event: EventService,
    private route: ActivatedRoute,
    private _route: Router,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.getNewsList();
  }

  getNewsList(): Promise<Array<News>> {
    return new Promise((resolve, reject) => {
      this.CmsService.getAuthorization(`news/read.php`).subscribe(response => {
        if (response.code === 200) {
          this.newsList = response.records;
          resolve(this.newsList);
        } else {
          this.newsList = [];
          reject(this.newsList);
        }
      });
    });
  }

  onDelete(id) {
    this.CmsService.deleteAuthorization(`news/delete.php?id=${id}`).subscribe(
      response => {
        if (response.code === 200) {
          this.event.showInfo("info", "Usunięto artykuł");
        } else this.event.showInfo("error", "Błąd usuwania artykułu");
      }
    );
  }

  onSelectionChange(event) {
    this._route.navigate([
      "/content/",
      { outlets: { "panel-outlet": ["news-add", event[0]] } }
    ]);
  }
}

export interface News {
  news_id: number;
  news_lead_img: string;
  news_name: string;
  news_lead: string;
  news_views: string;
  news_status_name: string;
  news_pub_date: string;
}
