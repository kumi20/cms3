import { Component, OnInit } from "@angular/core";
import { EventService } from "../../event.service";
import { AppService } from "../../app.service";
import { ActivatedRoute, Router } from "@angular/router";

import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl
} from "@angular/forms";

@Component({
  selector: "app-page",
  templateUrl: "./page.component.html",
  styleUrls: ["./page.component.scss"]
})
export class PageComponent implements OnInit {
  submitted: boolean = false;
  containerForm;
  containerList = [];
  formError = {
    pageContainerDesc: ""
  };

  validationMessages = {
    pageContainerDesc: {
      required: "Nazwa jest wymagana"
    }
  };
  popupVisible: boolean = false;
  constructor(
    private CmsService: AppService,
    private event: EventService,
    private route: ActivatedRoute,
    private _route: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.onGetContainerList();

    this.onCreateForm();

    this.containerForm.valueChanges.subscribe(value => {
      this.event.onControlValueChanged(
        this.containerForm,
        this.formError,
        this.validationMessages
      );
    });
  }

  onGetContainerList() {
    this.CmsService.getAuthorization(`page/read_container.php`).subscribe(
      response => {
        this.containerList = response.records;
      }
    );
  }

  onCreateForm() {
    this.containerForm = this.formBuilder.group({
      pageContainerDesc: ["", Validators.required]
    });
  }

  closeModal(){
    this.containerForm.reset();
  }

  onSendContainerForm(event) {
    this.submitted = true;
    if (this.containerForm.invalid) {
      this.event.onControlValueChanged(
        this.containerForm,
        this.formError,
        this.validationMessages
      );
      return;
    } else {
      this.CmsService.postAuthorization(
        `page/create_container.php`,
        event.value
      ).subscribe(response => {
        if (response.code === 200) {
          this.event.showInfo("success", "Dodano kontener");
          this.popupVisible = false;
          this.onGetContainerList();
        }
      });
      this.containerForm.reset();
      this.submitted = false;
    }
  }
}
