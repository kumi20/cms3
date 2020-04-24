import { Component, OnInit, ViewChild, Output, OnDestroy } from "@angular/core";
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
import { DatePipe } from "@angular/common";
import { Subject } from 'rxjs';

@Component({
  selector: "app-add-news",
  templateUrl: "./add-news.component.html",
  styleUrls: ["./add-news.component.scss"]
})
export class AddNewsComponent implements OnInit, OnDestroy {
  @ViewChild('dxList', {static: false}) dxList;
  newsForm;
  newsGroupList;
  initTinyMce = this.event.initTinyMce;
  popupVisible: boolean = false;

  submitted: boolean = false;
  selectedItemKeys = [];

  formError = {
    title: "",
    dataPublication: "",
    text: ""
  };

  validationMessages = {
    title: {
      required: "Tytuł jest wymagana"
    },
    dataPublication: {
      required: "Data publikacji jest wymagana"
    },
    text: {
      required: "Tekst jest wymagany",
      minlength: "Minimalna liczba znaków to 10"
    }
  };

  idNews;
  idNewsSubscribe;

  private syncSubject = new Subject<any>();

  constructor(
    private CmsService: AppService,
    private event: EventService,
    private route: ActivatedRoute,
    private _route: Router,
    public formBuilder: FormBuilder
  ) {
    this.event.onAddingNewsGroup.subscribe(() => this.closeModal());
  }

  ngOnInit() {
    this.onCreateForm();
    this.getNewsGroupList();

    this.idNewsSubscribe = this.route.params.subscribe(
      params => (this.idNews = parseInt(params["id"]))
    );

    this.syncSubject.subscribe((data)=>{
      this.CmsService.getAuthorization(`newsgroup/read.php`).subscribe(response=>{
        this.newsGroupList = response.records;
        if (!isNaN(this.idNews)) {
          this.setDataNews()
        }
        return this.newsGroupList;
      })
    })

    this.syncSubject.next();


    this.newsForm.valueChanges.subscribe(value => {
      this.event.onControlValueChanged(
        this.newsForm,
        this.formError,
        this.validationMessages
      );
    });
  }

  ngOnDestroy() {
    //this.event.onAddingNewsGroup.unsubscribe();
    this.idNewsSubscribe.unsubscribe();
  }

  onCreateForm() {
    this.newsForm = this.formBuilder.group({
      title: ["", Validators.required],
      lead: "",
      imgLead: "",
      dataPublication: ["", Validators.required],
      publication: false,
      text: ["", [Validators.required, Validators.minLength(10)]],
      group: this.formBuilder.array([]),
      galery: 0,
      idNewsa: 0
    });
  }

  getNewsGroupList() {
    this.CmsService.getAuthorization(`newsgroup/read.php`).subscribe(
      response => {
        this.newsGroupList = response.records;
      }
    );
  }

  onValueChanged() {
    new DatePipe("en-US").transform(this.newsForm.get("dataPublication").value)
      ? this.newsForm.controls.dataPublication.setValue(
          new DatePipe("en-US").transform(
            this.newsForm.get("dataPublication").value,
            "yyyy-MM-dd"
          )
        )
      : this.newsForm.controls.dataPublication.setValue("");
  }

  onSubmitedForm(value) {
    this.submitted = true;
    if (this.newsForm.invalid) {
      this.event.onControlValueChanged(
        this.newsForm,
        this.formError,
        this.validationMessages
      );
      return;
    } else {
      if (value.idNewsa === 0) {
        this.CmsService.postAuthorization(`news/create.php`, value).subscribe(
          response => {
            if (response.code === 200) {
              this.event.showInfo("success", "News dodany");
              this._route.navigate([
                "/content/",
                { outlets: { "panel-outlet": ["news"] } }
              ]);
              this.newsForm.reset();
              this.submitted = false;
            }
          }
        );
      } else {
        this.CmsService.putAuthorization(`news/update.php`, value).subscribe(
          response => {
            if (response.code === 200) {
              this.event.showInfo("success", "News dodany");
              this._route.navigate([
                "/content/",
                { outlets: { "panel-outlet": ["news"] } }
              ]);
              this.newsForm.reset();
              this.submitted = false;
            }
          }
        );
      }
    }
  }

  closeModal() {
    this.event.onClosedFormGroup.emit(true);
    this.popupVisible = false;
    this.getNewsGroupList();
  }

  onDeleteGroup(index) {
    this.CmsService.deleteAuthorization(
      `newsgroup/delete.php?id=${index}`
    ).subscribe(response => {
      if (response.code === 200) {
        this.event.showInfo("success", "Usunięto grupe");
        this.getNewsGroupList();
      }
    });
  }

  onSelectionChanged(event) {
    while (this.newsForm.get('group').value.length) {
      this.newsForm.get('group').removeAt(0);
    } 
    this.dxList.selectedItemKeys.forEach(item => {
      this.newsForm.get("group").push(new FormControl(item.newsGroupId));
    });
    for (let i = 0; i < this.newsForm.get("group").value.length; i++) {
      event.removedItems.forEach(item => {
        if (item.newsGroupId === this.newsForm.get("group").value[i])
          this.newsForm.get("group").removeAt(i, 1);
      });
    }
  }

  setDataNews() {
    this.CmsService.getAuthorization(
      `news/read_one.php?id=${this.idNews}`
    ).subscribe(response => {
      this.newsForm.patchValue({
        title: response.records[0].title,
        lead: response.records[0].lead,
        imgLead: response.records[0].imgLead,
        dataPublication: response.records[0].dataPublication,
        publication: response.records[0].publication,
        text: response.records[0].text,
        //group: response.records[0].group,
        galery: response.records[0].galery,
        idNewsa: response.records[0].idNewsa
      });
      response.records.forEach(item => {
        this.newsForm.get("group").push(new FormControl(item.news_group_id));
      });
      this.newsForm.get("group").value.forEach(item => {
        this.newsGroupList.forEach(group => {
          if (item == group.newsGroupId) this.selectedItemKeys.push(group);
        });
      });
    });
  }

  setIdGalleryNews(id) {
    this.newsForm.controls.galery.setValue(id);
  }
}
