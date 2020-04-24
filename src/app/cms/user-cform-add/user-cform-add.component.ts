import { Component, OnInit, OnDestroy } from "@angular/core";
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
  selector: "app-user-cform-add",
  templateUrl: "./user-cform-add.component.html",
  styleUrls: ["./user-cform-add.component.scss"]
})
export class UserCformAddComponent implements OnInit {
  userForm;
  cformUserError = {
    cformUserName: "",
    cformUserEmail: "",
    cformuserTitle: ""
  };

  validationCformUser = {
    cformUserName: {
      required: "Imię i nazwisko jest wymagane"
    },
    cformUserEmail: {
      required: "Email jest wymagany",
      email: "Podaj poprawny adres email"
    },
    cformuserTitle: {
      required: "Stanowisko jest wymagane"
    }
  };

  submitted: boolean = false; 

  constructor(
    private CmsService: AppService,
    private event: EventService,
    public formBuilder: FormBuilder
  ) {
    this.event.onClosedFormGroup.subscribe(()=>this.resetForm());
  }

  ngOnInit() {
    this.onCreateForm();

    this.userForm.valueChanges.subscribe(value => {
      this.event.onControlValueChanged(
        this.userForm,
        this.cformUserError,
        this.validationCformUser
      );
    });
  }

  onCreateForm() {
    this.userForm = this.formBuilder.group({
      cformUserName: ["", Validators.required],
      cformUserEmail: ["", [Validators.required, Validators.email]],
      cformuserTitle: ["", Validators.required],
      cformUserId: 0
    });
  }

  onSubmitedForm(value){
    this.submitted = true;
    if(this.userForm.invalid){
      this.event.onControlValueChanged(
        this.userForm,
        this.cformUserError,
        this.validationCformUser
      );
      return;
    }
    else{
      this.CmsService.postAuthorization(`cform/create_adress.php`, value).subscribe(response=>{
        if(response.code === 200){
            this.event.showInfo('success', 'Dodano nowego adresata');
            this.userForm.reset();
            this.event.onAddingNewsGroup.emit(true);
        }
    })
    }
  }

  resetForm(){
    this.userForm.reset();
    this.submitted = false;
  }
}
