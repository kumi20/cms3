import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AppService } from "../../app.service";
import { EventService } from "../../event.service";

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"]
})
export class MapComponent implements OnInit {
  mapList;
  constructor(
    private CmsService: AppService,
    private event: EventService,
    private route: ActivatedRoute,
    private _route: Router
  ) {}

  ngOnInit() {
    this.getMapList();
  }

  getMapList() {
    this.CmsService.getAuthorization(`map/read.php`).subscribe(response => {
      if (response.code === 200) {
        this.mapList = response.records;
      }
    });
  }

  onDelete(id) {
    this.CmsService.deleteAuthorization(`map/delete.php?id=${id}`).subscribe(
      repsonse => {
        if (repsonse.code === 200) this.event.showInfo("info", "Usunięto mapę");
      }
    );
  }

  onSelectionChange(id) {
    this._route.navigate([
      "/content/",
      { outlets: { "panel-outlet": ["map-add", id[0]] } }
    ]);
  }
}
