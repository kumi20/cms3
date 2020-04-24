import { Component, OnInit, ViewChild } from "@angular/core";
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

import { MouseEvent } from "@agm/core";
import { Subject } from "rxjs";

export class marker {
  lat: number = 0;
  lng: number = 0;
  title: string = "";
  draggable: boolean = true;
  description: string = "";
  grupa?: any[] = [];

  constructor() {}
}

export interface grupMapPoint {
  map_group_id: string;
  map_group_name: string;
  checked?: boolean;
}

@Component({
  selector: "app-add-map",
  templateUrl: "./add-map.component.html",
  styleUrls: ["./add-map.component.scss"]
})
export class AddMapComponent implements OnInit {
  @ViewChild("dxList", { static: false }) dxList;
  mapForm;
  initTinyMce = this.event.initTinyMce;
  markerList: marker[] = [];
  zoom: number = 8;
  label: string = "";
  description: string = "";
  latMap;
  lngMap;

  lat: number = 52.22977;
  lng: number = 21.01178;

  selectedItemKeys = [];
  submitted: boolean = false;
  popupVisible: boolean = false;

  mapGroupList = [];

  formError = {
    mapName: "",
    mapContent: ""
  };

  validationMessages = {
    mapName: {
      required: "Nazwa jest wymagana"
    },
    mapContent: {
      required: "Opis jest wymagany"
    }
  };

  idMapSubscribe;
  idMap;

  private syncSubject = new Subject<any>();

  constructor(
    private CmsService: AppService,
    private event: EventService,
    private route: ActivatedRoute,
    private _route: Router,
    public formBuilder: FormBuilder
  ) {
    this.event.onAddingNewsGroup.subscribe(() => this.closeModal());
  }

  ngOnInit() {
    this.idMapSubscribe = this.route.params.subscribe(
      params => (this.idMap = parseInt(params["id"]))
    );

    this.onCreateForm();

    this.syncSubject.subscribe(data => {
      this.CmsService.getAuthorization(`mapgroup/read.php`).subscribe(
        response => {
          this.mapGroupList = response.records;
          if (!isNaN(this.idMap)) {
            this.setDataMap();
          }
          return this.mapGroupList;
        }
      );
    });

    this.syncSubject.next();

    this.mapForm.valueChanges.subscribe(value => {
      this.event.onControlValueChanged(
        this.mapForm,
        this.formError,
        this.validationMessages
      );
    });
  }

  clickedMarker(index: number, lat, lang, description) {
    this.mapForm.controls.mapSzer.setValue(lat);
    this.mapForm.controls.mapDlug.setValue(lang);
  }

  mapClicked(event: MouseEvent) {
    if (this.markerList.length > 0) {
      this.event.showInfo("info", "Można dodać tylko 1 punkt");
    } else {
      this.mapForm.controls.mapSzer.setValue(event.coords.lat);
      this.mapForm.controls.mapDlug.setValue(event.coords.lng);

      this.markerList.push({
        lat: event.coords.lat,
        lng: event.coords.lng,
        draggable: true,
        title: "",
        grupa: [],
        description: this.description
      });
    }
  }

  markerDragEnd(m, event) {
    this.mapForm.controls.mapSzer.setValue(event.coords.lat);
    this.mapForm.controls.mapDlug.setValue(event.coords.lng);
  }
  onCreateForm() {
    this.mapForm = this.formBuilder.group({
      mapName: ["", Validators.required],
      mapContent: ["", Validators.required],
      mapSzer: [{ value: "", disabled: true }],
      mapDlug: [{ value: "", disabled: true }],
      group: this.formBuilder.array([]),
      mapId: 0
    });
  }

  onSubmitedForm(value) {
    this.submitted = true;
    if (this.mapForm.invalid) {
      this.event.onControlValueChanged(
        this.mapForm,
        this.formError,
        this.validationMessages
      );
      return;
    } else {
      while (this.mapForm.get("group").value.length) {
        this.mapForm.get("group").removeAt(0);
      }
      this.dxList.selectedItemKeys.forEach(item => {
        this.mapForm.get("group").push(new FormControl(item.map_group_id));
      });
      if (value.mapId == 0) {
        this.CmsService.postAuthorization(
          `map/create.php`,
          this.mapForm.getRawValue()
        ).subscribe(response => {
          if (response.code === 200) {
            this.mapForm.controls.mapId.setValue(Number(response.mapId));
            value.group.forEach(field => {
              this.CmsService.postAuthorization(
                `map/create_group_con.php?id=${this.mapForm.controls.mapId.value}`,
                field
              ).subscribe(response => {
                if (response.code !== 200)
                  this.event.showInfo("error", "Błąd dodawania");
              });
            });
            this.event.showInfo("success", "Dodano mape");
            this._route.navigate([
              "/content/",
              { outlets: { "panel-outlet": ["map"] } }
            ]);
          } else this.event.showInfo("error", response.opis);
        });
        this.submitted = false;
      } else {
        this.CmsService.putAuthorization(
          `map/update.php`,
          this.mapForm.getRawValue()
        ).subscribe(response => {
          if (response.code === 200) {
            value.group.forEach(field => {
              console.log('updat', field)
              this.CmsService.postAuthorization(
                `map/create_group_con.php?id=${this.mapForm.controls.mapId.value}`,
                field
              ).subscribe(response => {});
            });
            this.event.showInfo("success", "Dodano mape");
            this._route.navigate([
              "/content/",
              { outlets: { "panel-outlet": ["map"] } }
            ]);
          } else this.event.showInfo("error", response.opis);
        });
        this.submitted = false;
      }
    }
  }

  closeModal() {
    this.event.onClosedFormGroup.emit(true);
    this.popupVisible = false;
    this.getMapGroupList();
  }

  getMapGroupList() {
    this.CmsService.getAuthorization(`mapgroup/read.php`).subscribe(
      response => {
        this.mapGroupList = response.records;
        return this.mapGroupList;
      }
    );
  }

  onSelectionChanged(event) {
    while (this.mapForm.get("group").value.length) {
      this.mapForm.get("group").removeAt(0);
    }
    this.dxList.selectedItemKeys.forEach(item => {
      this.mapForm.get("group").push(new FormControl(item.newsGroupId));
    });
    for (let i = 0; i < this.mapForm.get("group").value.length; i++) {
      event.removedItems.forEach(item => {
        if (item.newsGroupId === this.mapForm.get("group").value[i])
          this.mapForm.get("group").removeAt(i, 1);
      });
    }
  }

  onDeleteGroup(index) {
    this.CmsService.deleteAuthorization(
      `mapgroup/delete.php?id=${index}`
    ).subscribe(response => {
      if (response.code === 200) {
        this.event.showInfo("success", "Usunięto grupe");
        this.getMapGroupList();
      }
    });
  }

  setDataMap() {
    this.CmsService.getAuthorization(
      `map/read_one.php?id=${this.idMap}`
    ).subscribe(response => {
      this.mapForm.patchValue({
        mapName: response.records[0].map_name,
        mapContent: response.records[0].map_content,
        mapSzer: response.records[0].map_szer,
        mapDlug: response.records[0].map_dlug,
        mapId: response.records[0].map_id
      });

      response.records.forEach(item => {
        this.mapForm.get("group").push(new FormControl(item.map_group_id));
      });

      this.markerList.push({
        lat: Number(response.records[0].map_szer),
        lng: Number(response.records[0].map_dlug),
        draggable: true,
        title: "",
        grupa: [],
        description: response.records[0].map_content
      });

      this.mapForm.get("group").value.forEach(item => {
        this.mapGroupList.forEach(group => {
          if (item == group.map_group_id) this.selectedItemKeys.push(group);
        });
      });
      ``;
    });
  }
}
