import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AppService } from "../../app.service";
import { EventService } from "../../event.service";

@Component({
  selector: "app-poll",
  templateUrl: "./poll.component.html",
  styleUrls: ["./poll.component.scss"]
})
export class PollComponent implements OnInit {
  pollList;

  constructor(
    private CmsService: AppService,
    private event: EventService,
    private route: ActivatedRoute,
    private _route: Router
  ) {}

  ngOnInit() {
    this.getListPoll();
  }

  getListPoll() {
    this.CmsService.getAuthorization(`poll/read.php`).subscribe(response => {
      if (response.code === 200) this.pollList = response.records;
    });
  }

  onDelete(id) {
    this.CmsService.deleteAuthorization(`poll/delete.php?id=${id}`).subscribe(
      response => {
        if (response.code === 200)
          this.event.showInfo("info", "Sonda została usunięta");
      }
    );
  }

  onSelectionChange(id) {
    this._route.navigate([
      "/content/",
      { outlets: { "panel-outlet": ["poll-add", id[0]] } }
    ]);
  }
}
