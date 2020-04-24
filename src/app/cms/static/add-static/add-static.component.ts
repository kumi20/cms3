import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../app.service';
import { EventService } from '../../../event.service';
import { ActivatedRoute, Router } from '@angular/router';
import {FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-static',
  templateUrl: './add-static.component.html',
  styleUrls: ['./add-static.component.scss']
})
export class AddStaticComponent implements OnInit {

  formStatic;
  idStatic;
  initTinyMce = this.event.initTinyMce;

  formError = {
      staticName:'',
      staticContent: '',
  }

  validationMessages = {
      staticName:{
          required:'Tytuł jest wymagany'
      },
      staticContent:{
          required:'Treść jest wymagana',
      }
  }

  submitted: boolean = false;

  constructor(private CmsService: AppService, private event: EventService, private route: ActivatedRoute, public formBuilder: FormBuilder, private _route: Router) { }

  ngOnInit() {
      this.route.params.subscribe(params => this.idStatic = parseInt(params['id']));  
      this.onCreateForm();

      if(!isNaN(this.idStatic)) this.getDateStatic(this.idStatic)

      this.formStatic.valueChanges.subscribe((value)=>{
          this.event.onControlValueChanged(this.formStatic, this.formError, this.validationMessages);
      });
  }

  onCreateForm(){
    this.formStatic = this.formBuilder.group({
      staticName: ['', Validators.required],
      staticContent: ['', Validators.required],
      staticId: [0]
    })
  }

  getDateStatic(id){
    return new Promise(resolve=>{
        this.CmsService.getAuthorization(`static/read_one.php?id=${id}`).subscribe(
             response=>{
                 this.formStatic.patchValue({
                    staticName: response.static_name,
                    staticContent: response.static_content,
                    staticId: response.static_id
                 });
        })
    });
  }  

  onSubmitedForm(value){
      this.submitted = true;
      if(this.formStatic.invalid){
          this.event.onControlValueChanged(this.formStatic, this.formError, this.validationMessages);
          return;
      }
      else{
          if(value.staticId != 0){
            this.CmsService.putAuthorization(`static/update.php`, value).subscribe(response=>{
              if(response.code === 200){
                      this.event.showInfo('success', 'Zaktualizowano treść');
                      this._route.navigate(['/content/', {outlets: { 'panel-outlet': ['static'] } }]);
                      this.formStatic.reset();
                  }
                  else{
                      this.event.showInfo('error', response.message)
                  }
              })
          }
          else{
            this.CmsService.postAuthorization(`static/create.php`, value).subscribe(response=>{
                if(response.code === 200){
                      this.event.showInfo('success', 'Dodano treść');
                      this._route.navigate(['/content/', {outlets: { 'panel-outlet': ['static'] } }]);
                      this.formStatic.reset();
                  }
                  else{
                      this.event.showInfo('error', response.message)
                  }
              })
          }
      }
  }
}
