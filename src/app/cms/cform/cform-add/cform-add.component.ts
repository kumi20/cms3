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
  selector: "app-cform-add",
  templateUrl: "./cform-add.component.html",
  styleUrls: ["./cform-add.component.scss"]
})
export class CformAddComponent implements OnInit {
  @ViewChild("grid", { static: false }) grid;
  cformError = {
    cformName: ""
  };

  validationMessages = {
    cformName: {
      required: "Nazwa jest wymagana"
    }
  };
  idCform;
  cForm;
  userCformList = [];

  submitted: boolean = false;
  popupVisible: boolean = false;
  selectedItemsKey = [];

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
    this.route.params.subscribe(
      params => (this.idCform = parseInt(params["id"]))
    );
    this.onCreateCform();

    this.syncSubject.subscribe(data => {
      this.CmsService.getAuthorization(`cform/read_adress.php`).subscribe(
        response => {
          this.userCformList = response.records;
          if (!isNaN(this.idCform)) {
            this.onGetDateCform(this.idCform);
          }
          return this.userCformList;
        }
      );
    });

    this.syncSubject.next();

    this.cForm.valueChanges.subscribe(value => {
      this.event.onControlValueChanged(
        this.cForm,
        this.cformError,
        this.validationMessages
      );
    });
  }

  onCreateCform() {
    this.cForm = this.formBuilder.group({
      cformName: ["", Validators.required],
      cformUser: this.formBuilder.array([]),
      cFormId: 0
    });
  }

  getUserCfromList() {
    this.CmsService.getAuthorization(`cform/read_adress.php`).subscribe(
      response => {
        this.userCformList = response.records;
      }
    );
  }

  onSubmitedForm(value) {
    this.submitted = true;
    if (this.cForm.invalid) {
      this.event.onControlValueChanged(
        this.cForm,
        this.cformError,
        this.validationMessages
      );
      return;
    } else {
      this.grid.selectedRowKeys.forEach(items => {
        this.cForm.get("cformUser").push(new FormControl(items));
      });

      if (value.cFormId === 0) {
        this.CmsService.postAuthorization(
          `cform/create.php`,
          this.cForm.value
        ).subscribe(response => {
          if (response.code === 200) {
            this.event.showInfo("success", "Dodano nowy formularz");
            this._route.navigate([
              "/content/",
              { outlets: { "panel-outlet": ["cform"] } }
            ]);
            this.cForm.reset();
            this.submitted = false;
          }
        });
      } else {
        this.CmsService.putAuthorization(
          `cform/update.php`,
          this.cForm.value
        ).subscribe(response => {
          if (response.code === 200) {
            this.event.showInfo("success", "Zaktualizowano nowy formularz");
            this._route.navigate([
              "/content/",
              { outlets: { "panel-outlet": ["cform"] } }
            ]);
            this.cForm.reset();
            this.submitted = false;
          }
        });
      }
    }
  }

  onGetDateCform(id) {
    this.CmsService.getAuthorization(`cform/read_one.php?id=${id}`).subscribe(
      response => {
        this.cForm.controls.cformName.setValue(response.records[0].cform_name);
        this.cForm.controls.cFormId.setValue(
          Number(response.records[0].cform_id)
        );
        response.records.forEach(items => {
          this.selectedItemsKey.push(items.cform_user_id);
        });
      }
    );
  }

  closeModal() {
    this.event.onClosedFormGroup.emit(true);
    this.popupVisible = false;
    this.getUserCfromList();
  }

  onDelete(id) {
    this.CmsService.deleteAuthorization(
      `cform/delete_adress.php?id=${id}`
    ).subscribe(response => {
      if (response.code === 200)
        this.event.showInfo("info", "Usunięto osobę kontaktową");
    });
  }

  onUpdateUserForm(id) {
    let pomUser;

    setTimeout(() => {
      this.userCformList.forEach(items => {
        if (items.cform_user_id == id.key) pomUser = items;
      });
      this.CmsService.putAuthorization(
        `cform/update_adress.php`,
        pomUser
      ).subscribe(response => {
        if (response.code === 200) {
          this.event.showInfo("success", "Zaktualizowano adresata");
        }
      });
    }, 1000);
  }
}
