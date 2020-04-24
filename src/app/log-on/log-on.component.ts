import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../app.service';
import { EventService } from '../event.service';
import { JwtHelper} from 'angular2-jwt'

@Component({
  selector: 'app-log-on',
  templateUrl: './log-on.component.html',
  styleUrls: ['./log-on.component.scss']
})
export class LogOnComponent implements OnInit {

  loginForm;
    submited: Boolean = false;

  formErrors = {
      user: '',
      psw: '',
  }

  validationMessages = {
        user:{
            required: 'Login jest wymagany'
        },
        psw:{
            required: 'Hasło jest wymagane',
        }
    }
    
  jwtHelper: JwtHelper = new JwtHelper();
  errorLogin: String = '';

  constructor(private CmsService: AppService, private event: EventService, private route: ActivatedRoute, private _route: Router, private formBuilder: FormBuilder) { }

  ngOnInit() {
      this.onCreateLoginForm();
  }

  onCreateLoginForm(){
    this.loginForm = this.formBuilder.group({
    user: ['', Validators.required],
    psw: ['', Validators.required]  
    });
  }

  onLogIn(event){
        this.submited = true;
        if(this.loginForm.valid){
            this.CmsService.post('user/logON.php', event.value).subscribe(
                response=>{                    
                    let tokenExpDate = this.jwtHelper.decodeToken(response);
                    if (tokenExpDate.code != 200 ) this.errorLogin = tokenExpDate.message;
                    else {
                      localStorage.setItem('cmsToken', response);
                      localStorage.setItem('user_nameCms', tokenExpDate.name);
                      this._route.navigateByUrl('content');
                    }
                    
                }
            )        
    }
    else{
        this.event.onControlValueChanged(this.loginForm, this.formErrors, this.validationMessages);
    }
  }

}
