import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AppService } from "../../app.service";
import { EventService } from "../../event.service";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl
} from "@angular/forms";

@Component({
  selector: "app-help",
  templateUrl: "./help.component.html",
  styleUrls: ["./help.component.scss"]
})
export class HelpComponent implements OnInit {
  emailForm;
  initTinyMce = this.event.initTinyMce;

  formError = {
    userEmail: "",
    titleEmail: "",
    messageEmail: ""
  };

  validationMessages = {
    userEmail: {
      required: "Email jest wymagany",
      email: "Podaj poprawny adres email"
    },
    titleEmail: {
      required: "Tytuł jest wymagany"
    },
    messageEmail: {
      required: "Treśc wiadomości jest wymagana"
    }
  };

  submitted: boolean = false;

  constructor(
    private CmsService: AppService,
    private event: EventService,
    private route: ActivatedRoute,
    private _route: Router,
    public formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.onCreateForm();

    this.emailForm.valueChanges.subscribe(value => {
      this.event.onControlValueChanged(
        this.emailForm,
        this.formError,
        this.validationMessages
      );
    });
  }

  onCreateForm() {
    this.emailForm = this.formBuilder.group({
      userEmail: ["", [Validators.required, Validators.email]],
      titleEmail: ["", Validators.required],
      messageEmail: ["", Validators.required]
    });
  }

  onSendEmail(event) {
    this.submitted = true;
    if (this.emailForm.invalid) {
      this.event.onControlValueChanged(
        this.emailForm,
        this.formError,
        this.validationMessages
      );
      return;
    } else {
      this.CmsService.postAuthorization(
        `help/sendEmail.php`,
        event.value
      ).subscribe(response => {
        if (response.code === 200) {
          this.event.showInfo("success", "Wysłano wiadomośc");
          this.emailForm.reset();
          this.submitted = false;
        }
      });
    }
  }
}
