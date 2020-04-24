import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AppService } from "../../app.service";
import { EventService } from "../../event.service";

@Component({
  selector: "app-cform",
  templateUrl: "./cform.component.html",
  styleUrls: ["./cform.component.scss"]
})
export class CformComponent implements OnInit {
  cformList = [];
  constructor(
    private CmsService: AppService,
    private event: EventService,
    private route: ActivatedRoute,
    private _route: Router
  ) {}

  ngOnInit() {
    this.getCformList();
  }

  getCformList() {
    this.CmsService.getAuthorization(`cform/read.php`).subscribe(response => {
      if (response.code === 200) this.cformList = response.records;
    });
  }

  onSelectionChange(event) {
    this._route.navigate([
      "/content/",
      { outlets: { "panel-outlet": ["cform-add", event[0]] } }
    ]);
  }

  onDelete(id) {
    this.CmsService.deleteAuthorization(`cform/delete.php?id=${id}`).subscribe(
      response => {
        if (response.code === 200)
          this.event.showInfo("info", "Formularz został usunięty");
      }
    );
  }
}
