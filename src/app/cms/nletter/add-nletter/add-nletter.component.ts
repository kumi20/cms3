import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl
} from "@angular/forms";
import { EventService } from "../../../event.service";
import { AppService } from "../../../app.service";
import { DatePipe } from "@angular/common";
import { ReturnStatement } from "@angular/compiler";

@Component({
  selector: "app-add-nletter",
  templateUrl: "./add-nletter.component.html",
  styleUrls: ["./add-nletter.component.scss"]
})
export class AddNletterComponent implements OnInit {
  nletterForm;
  newsError = {
    nletterName: "",
    nletterData: "",
    nletterContent: ""
  };

  validationMessages = {
    nletterName: {
      required: "Tytuł jest wymagany"
    },
    nletterData: {
      required: "Data jest wymagana"
    },
    nletterContent: {
      required: "Data publikacji jest wymagana"
    }
  };
  submitted: boolean = false;
  initTinyMce = this.event.initTinyMce;
  idNewsletter;
  constructor(
    private CmsService: AppService,
    private event: EventService,
    private route: ActivatedRoute,
    private _route: Router,
    public formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.onCreateForm();

    this.route.params.subscribe(
      params => (this.idNewsletter = parseInt(params["id"]))
    );

    if (!isNaN(this.idNewsletter)) {
      this.onGetDateNewsletter(this.idNewsletter);
    }

    this.nletterForm.valueChanges.subscribe(value => {
      this.event.onControlValueChanged(
        this.nletterForm,
        this.newsError,
        this.validationMessages
      );
    });
  }

  onCreateForm() {
    this.nletterForm = this.formBuilder.group({
      nletterName: ["", Validators.required],
      nletterData: ["", Validators.required],
      nletterContent: ["", Validators.required],
      nletterSent: [false],
      nletterId: 0
    });
  }

  onValueChanged() {
    new DatePipe("en-US").transform(this.nletterForm.get("nletterData").value)
      ? this.nletterForm.controls.nletterData.setValue(
          new DatePipe("en-US").transform(
            this.nletterForm.get("nletterData").value,
            "yyyy-MM-dd"
          )
        )
      : this.nletterForm.controls.nletterData.setValue("");
  }

  onSubmitedForm(value) {
    this.submitted = true;
    if (this.nletterForm.invalid) {
      this.event.onControlValueChanged(
        this.nletterForm,
        this.newsError,
        this.validationMessages
      );
      return;
    } else {
      if (value.nletterId === 0) {
        this.CmsService.postAuthorization(
          `nletter/create.php`,
          value
        ).subscribe(response => {
          if (response.code === 200) {
            this.event.showInfo("success", "Newsletter dodany");
            this._route.navigate([
              "/content/",
              { outlets: { "panel-outlet": ["nletter"] } }
            ]);
            this.nletterForm.reset();
            this.submitted = false;
          }
        });
      } else {
        this.CmsService.putAuthorization(`nletter/update.php`, value).subscribe(
          response => {
            if (response.code === 200) {
              this.event.showInfo("success", "Newsletter dodany");
              this._route.navigate([
                "/content/",
                { outlets: { "panel-outlet": ["nletter"] } }
              ]);
              this.nletterForm.reset();
              this.submitted = false;
            }
          }
        );
      }
    }
  }

  onGetDateNewsletter(id) {
    this.CmsService.getAuthorization(`nletter/read_one.php?id=${id}`).subscribe(response=>{
      this.nletterForm.controls.nletterName.setValue(response.nletter_name);
      this.nletterForm.controls.nletterData.setValue(response.nletter_data);
      this.nletterForm.controls.nletterContent.setValue(response.nletter_content);
      this.nletterForm.controls.nletterSent.setValue(response.nletter_sent);
      this.nletterForm.controls.nletterId.setValue(Number(response.nletter_id));
  })
  }
}
