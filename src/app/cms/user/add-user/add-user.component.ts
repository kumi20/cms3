import { Component, OnInit } from "@angular/core";
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

import { matchOtherValidator } from "./validator";

@Component({
  selector: "app-add-user",
  templateUrl: "./add-user.component.html",
  styleUrls: ["./add-user.component.scss"]
})
export class AddUserComponent implements OnInit {
  idUser;
  userForm;
  submitted: boolean = false;

  statusList = [
    { value: "", label: "-- wybierz status --", disabled: true },
    { value: 1, label: "aktywny" },
    { value: 2, label: "zablokowany" },
    { value: 3, label: "usunięty" }
  ];

  userError = {
    userLogin: "",
    userPsw: "",
    userPswRepeat: "",
    userName: "",
    userEmail: "",
    userStatus: ""
  };

  validationMessages = {
    userLogin: {
      required: "Login jest wymagany"
    },
    userPsw: {
      required: "Hasło jest wymagane"
    },
    userPswRepeat: {
      required: "Hasło jest wymagane",
      checkIfPasswordIdentical: "Podane hasła nie sa identyczne"
    },
    userName: {
      required: "Imie i nazwisko jest wymagane"
    },
    userEmail: {
      required: "Email jest wymagany",
      email: "Podaj poprawny adres email"
    },
    userStatus: {
      required: "Status jest wymagany"
    }
  };
  constructor(
    private CmsService: AppService,
    private event: EventService,
    private route: ActivatedRoute,
    private _route: Router,
    public formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.route.params.subscribe(
      params => (this.idUser = parseInt(params["id"]))
    );

    this.onCreatauserForm();

    if (!isNaN(this.idUser)) this.onGetDateUser(this.idUser);

    this.userForm.valueChanges.subscribe(value => {
      this.event.onControlValueChanged(
        this.userForm,
        this.userError,
        this.validationMessages
      );
    });
  }

  onCreatauserForm() {
    this.userForm = this.formBuilder.group({
      userLogin: ["", Validators.required],
      userPsw: ["", Validators.required],
      userPswRepeat: [
        "",
        [Validators.required, matchOtherValidator("userPsw")]
      ],
      userName: ["", Validators.required],
      userEmail: ["", [Validators.required, Validators.email]],
      userStatus: ["", Validators.required],
      userId: 0
    });
  }

  onSubmitUser(event) {
    this.submitted = true;

    if (this.userForm.invalid) {
      this.event.onControlValueChanged(
        this.userForm,
        this.userError,
        this.validationMessages
      );
      return;
    } else {
      if (event.value.userId === 0) {
        this.CmsService.postAuthorization(
          `user/create.php`,
          event.value
        ).subscribe(response => {
          if (response.code === 200) {
            this.event.showInfo("success", "Dodano uzytkownika");
            this.userForm.reset();
            this._route.navigate([
              "/content/",
              { outlets: { "panel-outlet": ["user"] } }
            ]);
          } else this.event.showInfo("error", response.opis);
        });
        this.submitted = false;
      } else {
        this.CmsService.putAuthorization(
          `user/update.php`,
          event.value
        ).subscribe(response => {
          if (response.code === 200) {
            this.event.showInfo("success", "Dodano uzytkownika");
            this.userForm.reset();
            this._route.navigate([
              "/content/",
              { outlets: { "panel-outlet": ["user"] } }
            ]);
            this.submitted = false;
          }
        });
      }
    }
  }

  onGetDateUser(id) {
    this.CmsService.getAuthorization(`user/read_one.php?id=${id}`).subscribe(
      response => {
        this.userForm.controls.userLogin.setValue(response.user_login);
        this.userForm.controls.userPsw.setValue(atob(response.user_password));
        this.userForm.controls.userPswRepeat.setValue(
          atob(response.user_password)
        );
        this.userForm.controls.userName.setValue(response.user_name);
        this.userForm.controls.userEmail.setValue(response.user_email);
        this.userForm.controls.userStatus.setValue(
          Number(response.user_status_id)
        );
        this.userForm.controls.userId.setValue(Number(response.user_id));
      }
    );
  }
}
