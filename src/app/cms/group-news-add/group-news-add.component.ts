import { Component, OnInit, OnDestroy } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { EventService } from '../../event.service';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-group-news-add',
  templateUrl: './group-news-add.component.html',
  styleUrls: ['./group-news-add.component.scss']
})
export class GroupNewsAddComponent implements OnInit, OnDestroy {

  groupNewsForm;
  submitted: boolean = false;

  formError = {
    newsGroupName:'',
    newsGroupPerpage: ''
  }

  validationMessages = {
      newsGroupName:{
          required:'Nazwa grupy jest wymagana'
      },
      newsGroupPerpage:{
          required:'ilośc newsów na stronie jest wymagana',
      }
  }

  constructor(private CmsService: AppService, public formBuilder: FormBuilder, private event: EventService) { 
      this.event.onClosedFormGroup.subscribe(()=>this.resetForm());
  }

  ngOnInit() {
      this.onCreateForm();

      this.groupNewsForm.valueChanges.subscribe((value)=>{
        this.event.onControlValueChanged(this.groupNewsForm, this.formError, this.validationMessages);
      });
  }

  ngOnDestroy(){
      this.event.onClosedFormGroup.unsubscribe();
  }

  onCreateForm(){
    this.groupNewsForm = this.formBuilder.group({
        newsGroupName: ['', Validators.required],
        newsGroupPerpage: ['', Validators.required],
        idGroup: 0
    })
  }  

  onSubmitedForm(value){
      this.submitted = true;
      if(this.groupNewsForm.invalid){
          this.event.onControlValueChanged(this.groupNewsForm, this.formError, this.validationMessages);
          return;
      }
      else{

          if(value.idGroup === 0){
              this.CmsService.postAuthorization(`newsgroup/create.php`, value).subscribe(response=>{
                if(response.code === 200){
                  this.event.showInfo('success', 'Dodano nową grupę');
                  this.event.onAddingNewsGroup.emit(true);
                }
              })
          }
          else{
              this.CmsService.putAuthorization(`newsgroup/update.php`, value).subscribe(response=>{
                  if(response.code === 200){
                    this.event.showInfo('success', 'Dodano nową grupę');
                    this.event.onAddingNewsGroup.emit(true);
                  }
              })
          }
      }
  }

  resetForm(){
    this.groupNewsForm.reset();
    this.submitted = false;
  }
}
