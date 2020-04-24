import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AppService } from "../../app.service";
import { EventService } from "../../event.service";

@Component({
  selector: "app-nletter",
  templateUrl: "./nletter.component.html",
  styleUrls: ["./nletter.component.scss"]
})
export class NletterComponent implements OnInit {
  nletterList = [];
  constructor(
    private CmsService: AppService,
    private event: EventService,
    private route: ActivatedRoute,
    private _route: Router
  ) {}

  ngOnInit() {
    this.getNletterList();
  }

  getNletterList() {
    this.CmsService.getAuthorization(`nletter/read.php`).subscribe(response => {
      if (response.code === 200) this.nletterList = response.records;
      console.log(this.nletterList);
    });
  }

  onDelete(id) {
    this.CmsService.deleteAuthorization(
      `nletter/delete.php?id=${id}`
    ).subscribe(response => {
      if (response.code === 200) {
        this.event.showInfo("info", "Usunięto newsletter");
      } else this.event.showInfo("error", "Błąd usuwania artykułu");
    });
  }

  onSelectionChange(event) {
    this._route.navigate([
      "/content/",
      { outlets: { "panel-outlet": ["nletter-add", event[0]] } }
    ]);
  }

  sendNesletter(id, event) {
    event.stopPropagation();
    this.CmsService.getAuthorization(`nletter/send.php?id=${id}`).subscribe(
      response => {
        if (response.code === 200) {
          this.event.showInfo("success", "Newsletter został wysłany");
          this.getNletterList();
        } else this.event.showInfo("error", response.opsi);
      }
    );
  }
}
