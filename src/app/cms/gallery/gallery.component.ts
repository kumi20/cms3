import { Component, OnInit } from "@angular/core";
import { EventService } from "../../event.service";
import { AppService } from "../../app.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-gallery",
  templateUrl: "./gallery.component.html",
  styleUrls: ["./gallery.component.scss"]
})
export class GalleryComponent implements OnInit {
  galleryList;
  uriGallery = this.CmsService.uriGallery;
  constructor(
    private CmsService: AppService,
    private event: EventService,
    private _route: Router
  ) {}

  ngOnInit() {
    this.getGalleryList();
  }

  getGalleryList() {
    this.CmsService.getAuthorization(`gallery/read.php`).subscribe(response => {
      this.galleryList = response.records;
      console.log(this.galleryList)
      this.galleryList.forEach(element => {
        element.uriImg = this.uriGallery + '/'+element.gallery_id + '/thumb/' + element.gallery_photo_name;
      });
    });
  }

  onDeleteGallery(id) {
    this.CmsService.deleteAuthorization(
      `gallery/delete.php?id=${id}`
    ).subscribe(response => {
      if (response.code === 200) {
        this.event.showInfo("info", "Usunięto galerię");
        this.getGalleryList();
      } else {
        this.event.showInfo("error", response.message);
      }
    });
  }

  onSelectionChange(event) {
    this._route.navigate([
      "/content/",
      { outlets: { "panel-outlet": ["gallery-add", event[0]] } }
    ]);
  }
}
