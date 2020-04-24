import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
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
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"]
})
export class SettingsComponent implements OnInit {
  settingsForm;
  constructor(
    private CmsService: AppService,
    private event: EventService,
    private route: ActivatedRoute,
    private _route: Router,
    public formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.onCreateSettingForm();
    this.onGetSettings();
  }

  onCreateSettingForm() {
    this.settingsForm = this.formBuilder.group({
      pageTitlePrefix: [""],
      sender: [""],
      analytics: [""],
      description: [""],
      keywords: [""]
    });
  }

  onSendSettingForm(event) {
    this.CmsService.postAuthorization(
      `config/update.php?param_id=4&param_value=${event.value.pageTitlePrefix}`,
      event.value
    ).subscribe(response => {});
    this.CmsService.postAuthorization(
      `config/update.php?param_id=6&param_value=${event.value.sender}`,
      event.value
    ).subscribe(response => {});
    this.CmsService.postAuthorization(
      `config/update.php?param_id=8&param_value=${event.value.analytics}`,
      event.value
    ).subscribe(response => {});
    this.CmsService.postAuthorization(
      `config/update.php?param_id=10&param_value=${event.value.description}`,
      event.value
    ).subscribe(response => {});
    this.CmsService.postAuthorization(
      `config/update.php?param_id=11&param_value=${event.value.keywords}`,
      event.value
    ).subscribe(response => {});
    this.event.showInfo("success", "zapisano ustawienia");
  }

  onGetSettings() {
    this.CmsService.getAuthorization(`config/read.php`).subscribe(response => {
      response.records.forEach(el => {
        if (el.param_name == "page_title_prefix")
          this.settingsForm.controls.pageTitlePrefix.setValue(el.param_value);
        if (el.param_name == "Sender")
          this.settingsForm.controls.sender.setValue(el.param_value);
        if (el.param_name == "analytics")
          this.settingsForm.controls.analytics.setValue(el.param_value);
        if (el.param_name == "description")
          this.settingsForm.controls.description.setValue(el.param_value);
        if (el.param_name == "keywords")
          this.settingsForm.controls.keywords.setValue(el.param_value);
      });
    });
  }
}
