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
import { Subject } from "rxjs";

@Component({
  selector: "app-add-menu",
  templateUrl: "./add-menu.component.html",
  styleUrls: ["./add-menu.component.scss"]
})
export class AddMenuComponent implements OnInit {
  @ViewChild("dxList", { static: false }) dxList;
  idMenu;
  menuForm;
  menuPageList = [];
  submitted: boolean = false;
  menuCssList = [];

  menuError = {
    menuName: "",
    menuHtmlClass: ""
  };

  validationMessages = {
    menuName: {
      required: "Nazwa jest wymagana"
    },
    menuHtmlClass: {
      required: "Klasa css menu jest wymagana"
    }
  };
  selectedItemKeys = [];
  private syncSubject = new Subject<any>();

  constructor(
    private CmsService: AppService,
    private event: EventService,
    private route: ActivatedRoute,
    private _route: Router,
    public formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.route.params.subscribe(
      params => (this.idMenu = parseInt(params["id"]))
    );

    this.onCreateMenuForm();
    this.onGetMenuCssCalss();

    this.syncSubject.subscribe(data => {
      this.CmsService.getAuthorization(`menu/read_pages.php`).subscribe(
        response => {
          this.menuPageList = response.records;
          if (!isNaN(this.idMenu)) {
            this.onGetDateMenu(this.idMenu);
          }
          return this.menuPageList;
        }
      );
    });

    this.syncSubject.next();

    this.menuForm.valueChanges.subscribe(value => {
      this.event.onControlValueChanged(
        this.menuForm,
        this.menuError,
        this.validationMessages
      );
    });
  }

  onCreateMenuForm() {
    this.menuForm = this.formBuilder.group({
      menuId: 0,
      menuName: ["", Validators.required],
      menuHtmlClass: ["", Validators.required],
      menuNode: this.formBuilder.array([])
    });
  }

  onGetMenuCssCalss() {
    this.CmsService.getAuthorization(`menu/read_menu_css.php`).subscribe(
      response => {
        response.records.forEach(field => {
          this.menuCssList.push({
            label: field.module_view_name,
            value: field.module_view_name
          });
        });
      }
    );
  }

  onSubmitedForm(event) {
    this.submitted = true;
    if (this.menuForm.invalid) {
      this.event.onControlValueChanged(
        this.menuForm,
        this.menuError,
        this.validationMessages
      );
      return;
    } else {
      this.dxList.selectedItemKeys.forEach(element => {
        this.menuForm.get("menuNode").push(new FormControl(element));
      });
      if (event.value.menuId === 0) {
        this.CmsService.postAuthorization(
          `menu/create.php`,
          event.value
        ).subscribe(response => {
          if (response.code === 200) {
            this.event.showInfo("success", "Menu zostało dodane");
            this.menuForm.reset();
            this._route.navigate([
              "/content/",
              { outlets: { "panel-outlet": ["menu"] } }
            ]);
            this.submitted = false;
          }
        });
      } else {
        this.CmsService.putAuthorization(
          `menu/update.php`,
          event.value
        ).subscribe(response => {
          if (response.code === 200) {
            this.event.showInfo("success", "Menu zostało dodane");
            this.menuForm.reset();
            this._route.navigate([
              "/content/",
              { outlets: { "panel-outlet": ["menu"] } }
            ]);
            this.submitted = false;
          }
        });
      }
    }
  }

  onGetDateMenu(id) {
    this.CmsService.getAuthorization(
      `menu/read_selected_pages.php?id=${id}`
    ).subscribe(response => {
      this.menuForm.controls.menuId.setValue(
        Number(response.records[0].menu_id)
      );
      this.menuForm.controls.menuName.setValue(response.records[0].menu_name);
      this.menuForm.controls.menuHtmlClass.setValue(
        response.records[0].menu_html_class
      );

      response.records.forEach(element => {
        this.menuPageList.forEach(items => {
          if (items.page_id === element.page_id)
            this.selectedItemKeys.push(items);
        });
      });
    });
  }
}
