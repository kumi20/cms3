import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AppService } from "../../app.service";
import { EventService } from "../../event.service";

@Component({
  selector: "app-content",
  templateUrl: "./content.component.html",
  styleUrls: ["./content.component.scss"]
})
export class ContentComponent implements OnInit {
  dataToday;
  day;
  month;
  dayName;

  newsList = [];
  topNews = [];

  constructor(
    private CmsService: AppService,
    private event: EventService,
    private route: ActivatedRoute,
    private _route: Router
  ) {}

  ngOnInit() {
    this.dataToday = new Date();
    switch (this.dataToday.getDay()) {
      case 0:
        this.dayName = "Niedziela";
        break;
      case 1:
        this.dayName = "Poniedziałek";
        break;
      case 2:
        this.dayName = "Wtorek";
        break;
      case 3:
        this.dayName = "Środa";
        break;
      case 4:
        this.dayName = "Czwartek";
        break;
      case 5:
        this.dayName = "Piątek";
        break;
      case 6:
        this.dayName = "Sobota";
        break;
    }

    switch (this.dataToday.getMonth()) {
      case 0:
        this.month = "Styczeń";
        break;
      case 1:
        this.month = "Luty";
        break;
      case 2:
        this.month = "Marzec";
        break;
      case 3:
        this.month = "Kwiecień";
        break;
      case 4:
        this.month = "Maj";
        break;
      case 5:
        this.month = "Czerwiec";
        break;
      case 6:
        this.month = "Lipiec";
        break;
      case 7:
        this.month = "Sierpień";
        break;
      case 8:
        this.month = "Wrzesień";
        break;
      case 9:
        this.month = "Październik";
        break;
      case 10:
        this.month = "Listopad";
        break;
      case 11:
        this.month = "Grudzień";
        break;
    }

    this.getNewsList();
    this.getTopNews();
  }

  getNewsList() {
    this.CmsService.getAuthorization(`news/read.php`).subscribe(response => {
      if (response.code === 200) {
        this.newsList = response.records;
        this.newsList.splice(3, this.newsList.length);
      }
    });
  }

  getTopNews() {
    this.CmsService.getAuthorization(`news/readTop.php`).subscribe(response => {
      if (response.code === 200) this.topNews = response.records;
    });
  }
}
