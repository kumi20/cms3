import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AppService } from "../../app.service";
import { EventService } from "../../event.service";

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.scss"]
})
export class UserComponent implements OnInit {
  userList = [];
  constructor(
    private CmsService: AppService,
    private event: EventService,
    private route: ActivatedRoute,
    private _route: Router
  ) {}

  ngOnInit() {
    this.onGetUserList();
  }

  onGetUserList() {
    this.CmsService.getAuthorization(`user/read.php`).subscribe(response => {
      this.userList = response.records;
    });
  }

  onDeleteUser(id) {
    this.CmsService.deleteAuthorization(`user/delete.php?id=${id}`).subscribe(
      response => {
        if (response.code === 200) {
          this.event.showInfo("info", "Usunięto użytkownika");
        } else this.event.showInfo("error", response.message);
      }
    );
  }

  onSelectionChange(event) {
    this._route.navigate([
      "/content/",
      { outlets: { "panel-outlet": ["user-add", event[0]] } }
    ]);
  }
}
