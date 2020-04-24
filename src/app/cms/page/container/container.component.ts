import { Component, OnInit } from "@angular/core";
import { EventService } from "../../../event.service";
import { AppService } from "../../../app.service";
import { ActivatedRoute, Router } from "@angular/router";
import { PageComponent } from "../page.component";

import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl
} from "@angular/forms";

@Component({
  selector: "app-container",
  templateUrl: "./container.component.html",
  styleUrls: ["./container.component.scss"],
  inputs: ["idContainer", "nameContainer"]
})
export class ContainerComponent implements OnInit {
  idPage;
  idContainer;
  nameContainer;

  formElement;
  submitted: boolean = false;
  popupVisible: boolean = false;

  moduleList = [];
  modelVliewList = [];
  elementList = [];
  constructor(
    private CmsService: AppService,
    private event: EventService,
    private route: ActivatedRoute,
    private _route: Router,
    private formBuilder: FormBuilder,
    private PageComponent: PageComponent
  ) {}

  ngOnInit() {
    this.route.params.subscribe(
      params => (this.idPage = parseInt(params["id"]))
    );
    if (isNaN(this.idPage)) this.idPage = 1;

    this.onCreateFormElement();
    this.onGetModule();
  }

  closeModal() {
    this.formElement.reset();
  }

  onGetModule() {
    this.CmsService.getAuthorization(`page/read_module.php`).subscribe(
      response => {
        response.records.forEach(element => {
          this.moduleList.push({
            value: element.module_id,
            label: element.module_full_name
          });
        });
      }
    );
  }

  onSendElementForm(event){
    this.submitted = true;
    if(this.formElement.invalid){
          //this.event.onControlValueChanged(this.formElement, this.newsError, this.validationMessages);
          return;
      }
      else{
          this.CmsService.postAuthorization(`page/create_page_elment.php`, event.value).subscribe(response=>{
              if(response.code === 200){
                  this.event.showInfo('success', "Dodany elemen");
                  this.popupVisible = false;
                  this.formElement.reset();
                  this.submitted = false;
                  this.PageComponent.onGetContainerList();
              }
              else this.event.showInfo('error', response.opis)                
          })
          
      }
}  

  onCreateFormElement() {
    this.formElement = this.formBuilder.group({
      pageContainerId: this.idContainer,
      pageId: this.idPage,
      moduleId: [""],
      pageElementElemid: [""],
      moduleViewId: [""]
    });
  }

  onDeleteContainer(id) {
    this.CmsService.deleteAuthorization(
      `page/delete_container.php?id=${id}`
    ).subscribe(response => {
      if (response.code === 200) {
        this.event.showInfo("success", "Usunięto kontener");
        this.PageComponent.onGetContainerList();
      }
    });
  }

  onSelectedModule(event) {
    this.CmsService.getAuthorization(
      `page/read_module_view.php?id=${event.selectedItem.value}`
    ).subscribe(response => {
      this.modelVliewList = [];
      response.records.forEach(element => {
        this.modelVliewList.push({
          value: element.module_view_id,
          label: element.module_view_name
        });
      });
    });
  }

  onSelectedView(event) {
    this.elementList = [];
    switch (event.selectedItem.value) {
      case "24":
        let uri = "static/read.php";
        this.elementList.length = 0;
        this.CmsService.getAuthorization(uri).subscribe(response => {
          response.records.forEach(element => {
            this.elementList.push({
              value: element.static_id,
              label: element.static_name
            });
          });
        });
        break;
      case "5":
        let grupa = "newsgroup/read.php";
        this.elementList.length = 0;
        this.CmsService.getAuthorization(grupa).subscribe(response => {
          response.records.forEach(element => {
            this.elementList.push({
              value: element.newsGroupId,
              label: element.newsGroupName
            });
          });
        });
        break;
      case "2":
        this.elementList.length = 0;
        this.CmsService.getAuthorization(`menu/read.php`).subscribe(
          response => {
            response.records.forEach(element => {
              this.elementList.push({
                value: element.menu_id,
                label: element.menu_name
              });
            });
          }
        );
        break;
      case "33":
        this.elementList.length = 0;
        this.CmsService.getAuthorization(`mapgroup/read.php`).subscribe(
          response => {
            response.records.forEach(element => {
              this.elementList.push({
                value: element.map_group_id,
                label: element.map_group_name
              });
            });
          }
        );
        break;
      case "9":
        this.elementList.length = 0;
        this.CmsService.getAuthorization(`cform/read.php`).subscribe(
          response => {
            response.records.forEach(element => {
              this.elementList.push({
                value: element.cform_id,
                label: element.cform_name
              });
            });
          }
        );
        break;
      case "12":
        this.elementList.length = 0;
        this.CmsService.getAuthorization(`poll/read.php`).subscribe(
          response => {
            response.records.forEach(element => {
              this.elementList.push({
                value: element.poll_id,
                label: element.poll_name
              });
            });
          }
        );
        break;
      case "6":
        this.elementList.length = 0;
        this.CmsService.getAuthorization(`gallery/read.php`).subscribe(
          response => {
            response.records.forEach(element => {
              this.elementList.push({
                value: element.gallery_id,
                label: element.gallery_name
              });
            });
          }
        );
        break;
      case "13":
        this.elementList = [{ value: "1", label: "standard" }];
        break;
      case "21":
        this.elementList = [{ value: "1", label: "standard" }];
        break;
    }
  }
}
