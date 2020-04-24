import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  Output,
  EventEmitter,
  Input,
  OnChanges
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AppService } from "../../../app.service";
import { EventService } from "../../../event.service";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl
} from "@angular/forms";

import { FileUploader } from "ng2-file-upload";
import { analyzeAndValidateNgModules } from "@angular/compiler";
const URL = "http://kumi20.webd.pl/api/cms/gallery/uploudImages.php";

@Component({
  selector: "app-add-gallery",
  templateUrl: "./add-gallery.component.html",
  styleUrls: ["./add-gallery.component.scss"]
})
export class AddGalleryComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild("uplouder", { static: false }) uplouder;

  @Output() sendIdGallery = new EventEmitter();
  @Input("newsGallery") newsGallery;
  @Input('idNewsGallery') idNewsGallery;

  galleryFrom;
  preview: string;
  submitted: boolean = false;

  public uploader: FileUploader = new FileUploader({ url: URL });
  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  formError = {
    galleryName: ""
  };

  validationMessages = {
    galleryName: {
      required: "Nazwa jest wymagany"
    }
  };

  idGallery;
  idGallerySubscribe;

  constructor(
    private CmsService: AppService,
    private event: EventService,
    private route: ActivatedRoute,
    private _route: Router,
    public formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.onCreateGalleryForm();
    this.configFileUploud();

    this.idGallerySubscribe = this.route.params.subscribe(
      params => (this.idGallery = parseInt(params["id"]))
    );

    if (!isNaN(this.idGallery)) {
      this.onGetDateGallery(this.idGallery);
    }

    this.galleryFrom.valueChanges.subscribe(value => {
      this.event.onControlValueChanged(
        this.galleryFrom,
        this.formError,
        this.validationMessages
      );
    });
  }

  ngOnDestroy() {
    this.idGallerySubscribe.unsubscribe();
  }

  ngOnChanges(){
    if(this.idNewsGallery !=0 ) this.onGetDateGallery(this.idNewsGallery);
  }

  onCreateGalleryForm() {
    this.galleryFrom = this.formBuilder.group({
      galleryName: ["", Validators.required],
      galleryDesc: [""],
      galleryPhoto: this.formBuilder.array([]),
      galleryId: 0
    });
  }

  onSubmitedForm(value) {
    this.submitted = true;
    if (this.galleryFrom.invalid) {
      this.event.onControlValueChanged(
        this.galleryFrom,
        this.formError,
        this.validationMessages
      );
      return;
    } else {
      if (value.galleryId === 0) {
        this.CmsService.postAuthorization(
          `gallery/create.php`,
          value
        ).subscribe(response => {
          if (response.code === 200) {
            this.galleryFrom.controls.galleryId.setValue(response.galleryId);
            this.upload();
            this.sendIdGallery.emit(response.galleryId);
            if (!this.newsGallery) {
              this._route.navigate([
                "/content/",
                { outlets: { "panel-outlet": ["gallery"] } }
              ]);
              this.galleryFrom.reset();
            }
          }
        });
      } else {
        this.CmsService.putAuthorization(`gallery/update.php`, value).subscribe(
          response => {
            if (response.code !== 200)
              this.event.showInfo("error", response.message);
            this.upload();
            if (!this.newsGallery) {
              this._route.navigate([
                "/content/",
                { outlets: { "panel-outlet": ["gallery"] } }
              ]);
              this.galleryFrom.reset();
            }
          }
        );
      }
    }
  }

  onDeletePhoto(id) {
    if (this.galleryFrom.get("galleryPhoto").value[id].gallery_photo_id != 0) {
      this.CmsService.deleteAuthorization(
        `gallery/deleteIMG.php?id=${
          this.galleryFrom.get("galleryPhoto").value[id].gallery_photo_id
        }`
      ).subscribe(response => {
        if (response.code === 200)
          this.event.showInfo("info", "Usunięto zdjęcie");
      });
      this.galleryFrom.get("galleryPhoto").removeAt(id, 1);
    } else {
      this.galleryFrom.get("galleryPhoto").removeAt(id, 1);
      this.uploader.queue.splice(id, 1);
    }
  }

  public configFileUploud() {
    this.uploader = new FileUploader({
      url: URL,
      authTokenHeader: "Authorizationtoken",
      authToken: localStorage.getItem("cmsToken"),
      autoUpload: false,
      allowedMimeType: ["image/jpg", "image/png", "image/jpeg"]
    });

    this.uploader.onAfterAddingFile = item => {
      item.withCredentials = false;
    };

    this.uploader.onAfterAddingAll = () => {
      for (let item of this.uploader.queue) {
        this.galleryFrom.get("galleryPhoto").push(
          this.formBuilder.group({
            gallery_photo_id: 0,
            gallery_id: this.galleryFrom.get("galleryId").value,
            gallery_photo_name: item.file.name,
            gallery_photo_desc: "",
            gallery_photo_copyrights: "",
            gallery_photo_filesize: item.file.size
          })
        );
      }
    };

    this.uploader.onWhenAddingFileFailed = () => {
      this.event.showInfo("error", "Niedozwolone rozszerzenie pliku");
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      this.event.showInfo("success", "Dodano zdjęcia");
    };
  }

  upload() {
    for (let item of this.uploader.queue) {
      item.url = `${this.CmsService.uriUploudImageGallery}?idKatalog=${this.galleryFrom.controls.galleryId.value}`;
      item.upload();
    }
  }

  onGetDateGallery(id) {
    this.CmsService.getAuthorization(
      `gallery/read_one.php?id=${id}`
    ).subscribe(response => {
      this.galleryFrom.patchValue({
        galleryId: response.records[0].gallery_id,
        galleryName: response.records[0].gallery_name,
        galleryDesc: response.records[0].gallery_desc
      });
      response.records[0].galleryPhoto.forEach(photo => {
        this.galleryFrom.get("galleryPhoto").push(
          this.formBuilder.group({
            gallery_photo_id: photo.gallery_photo_id,
            gallery_id: photo.gallery_id,
            gallery_photo_name: photo.gallery_photo_name,
            gallery_photo_desc: photo.gallery_photo_desc,
            gallery_photo_copyrights: photo.gallery_photo_copyrights,
            gallery_photo_filesize: photo.gallery_photo_filesize
          })
        );
      });
    });
  }
}
