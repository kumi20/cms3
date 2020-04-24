import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl
} from "@angular/forms";
import { EventService } from "../../event.service";
import { AppService } from "../../app.service";

@Component({
  selector: "app-group-map-add",
  templateUrl: "./group-map-add.component.html",
  styleUrls: ["./group-map-add.component.scss"]
})
export class GroupMapAddComponent implements OnInit {
  groupMapForm;
  submitted: boolean = false;

  formError = {
    mapGroupName: ""
  };

  validationMessages = {
    mapGroupName: {
      required: "Nazwa grupy jest wymagana"
    }
  };

  constructor(
    private CmsService: AppService,
    public formBuilder: FormBuilder,
    private event: EventService
  ) {
    this.event.onClosedFormGroup.subscribe(() => this.resetForm());
  }

  ngOnInit() {
    this.onCreateForm();

    this.groupMapForm.valueChanges.subscribe(value => {
      this.event.onControlValueChanged(
        this.groupMapForm,
        this.formError,
        this.validationMessages
      );
    });
  }

  onCreateForm() {
    this.groupMapForm = this.formBuilder.group({
      mapGroupName: ["", Validators.required],
      mapId: 0
    });
  }

  onSubmitedForm(value) {
    this.submitted = true;
    if (this.groupMapForm.invalid) {
      this.event.onControlValueChanged(
        this.groupMapForm,
        this.formError,
        this.validationMessages
      );
      return;
    } else {
      if (value.mapId === 0) {
        this.CmsService.postAuthorization(
          "mapgroup/create.php",
          value
        ).subscribe(response => {
          if (response.code === 200) {
            this.event.showInfo("success", "Dodano nową grupę");
            this.groupMapForm.reset();
            this.submitted = false;
            this.event.onAddingNewsGroup.emit(true);
          }
        });
      } else {
        this.CmsService.putAuthorization(
          "mapgroup/update.php",
          value
        ).subscribe(response => {
          if (response.code === 200) {
            this.groupMapForm.reset();
            this.event.onAddingNewsGroup.emit(true);
            this.submitted = false;
          }
        });
      }
    }
  }

  resetForm() {
    this.groupMapForm.reset();
    this.submitted = false;
  }
}
