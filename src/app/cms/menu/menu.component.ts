import { Component, OnInit } from "@angular/core";
import { EventService } from "../../event.service";
import { AppService } from "../../app.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"]
})
export class MenuComponent implements OnInit {
  menuList = [];
  constructor(
    private CmsService: AppService,
    private event: EventService,
    private route: ActivatedRoute,
    private _route: Router
  ) {}

  ngOnInit() {
    this.onGetMenuList();
  }

  onGetMenuList() {
    this.CmsService.getAuthorization(`menu/read.php`).subscribe(response => {
      this.menuList = response.records;
      console.log(this.menuList);
    });
  }

  onDeleteMenu(id) {
    this.CmsService.deleteAuthorization(`menu/delete.php?id=${id}`).subscribe(
      response => {
        if (response.code === 200) {
          this.event.showInfo("info", "Usunięto menu");
          this.onGetMenuList();
        } else this.event.showInfo("error", response.opis);
      }
    );
  }

  onSelectionChange(event) {
    this._route.navigate([
      "/content/",
      { outlets: { "panel-outlet": ["menu-add", event[0]] } }
    ]);
  }
}
