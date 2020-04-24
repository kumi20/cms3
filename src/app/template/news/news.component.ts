import { Subscriber } from "rxjs/Subscriber";
import {
  Component,
  OnInit,
  ElementRef,
  Input,
  ViewChild,
  Output,
  EventEmitter,
  Injector
} from "@angular/core";
import { AppService } from "../../app.service";
import { EventService } from "../../event.service";
import { ActivatedRoute, Router } from "@angular/router";
import { news } from "./news";

@Component({
  selector: "app-news",
  templateUrl: "./news.component.html",
  styleUrls: ["./news.component.scss"]
})
export class NewsComponentView implements OnInit {
  tresc;
  idtresci;
  pageElement;
  newsList;
  newsGroupName: string = "";
  firstNews: any[] = [];
  readArticle: boolean = false;
  news: news = new news();
  page;
  newsContent = {
    news_name: "",
    news_pub_date: "",
    news_lead: "",
    news_content: "",
    news_views: "",
    news_id: ""
  };

  popupVisible: boolean = false;

  constructor(
    private injector: Injector,
    private CmsService: AppService,
    private route: ActivatedRoute,
    private _route: Router,
    private event: EventService
  ) {
    this.idtresci = this.injector.get("idTresci", "");
    this.pageElement = this.injector.get("pageElement", "");
  }

  ngOnInit() {
    this.CmsService.get(
      `template/news/getNews.php?id=${this.idtresci}`
    ).subscribe(response => {
      if (response != null) {
        this.newsList = response.records;
      }
    });
  }

  listSelectionChanged(event) {
    this.newsContent = event.addedItems[0];
    this.CmsService.get(
      `template/news/updateNewsViews.php?id=${this.newsContent.news_id}`
    ).subscribe(response => { });
  }

  showArticle(id) {
    this.CmsService.get(`template/news/getNewsId.php?id=${id}`).subscribe(
      response => {
        this.news.news_content = response[0].news_content;
        this.news.news_lead = response[0].news_lead;
        this.news.news_lead_img = response[0].news_lead_img;
        this.news.news_name = response[0].news_name;
        this.news.news_pub_date = response[0].news_pub_date;
        this.news.news_views = response[0].news_views;
        this.readArticle = true;
      },
      error => {
        this.event.showInfo("error", "Błąd pobierania danych");
      }
    );
  }

  back() {
    this.readArticle = false;
  }

  pageChanged(page) {
    //this._route.navigate(['/content-24',page]);
    return page;
  }
}
