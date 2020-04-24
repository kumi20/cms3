import {
  Component,
  OnInit,
  ElementRef,
  Input,
  ViewChild,
  Output,
  EventEmitter,
  ViewChildren,
  AfterViewInit,
  OnDestroy
} from "@angular/core";
import { EventService } from "../../../event.service";
import { AppService } from "../../../app.service";
import { ActivatedRoute, Router } from "@angular/router";

import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl
} from "@angular/forms";

import { DragulaService } from "ng2-dragula";
import { PageComponent } from "../page.component";

@Component({
  selector: "app-menu-page",
  templateUrl: "./menu-page.component.html",
  styleUrls: ["./menu-page.component.scss"]
})
export class MenuPageComponent implements OnInit, OnDestroy {
  @Input() idParent;
  @Input() idLevel;

  menuList = [];

  pageForm;

  submitted: boolean = false;

  formError = {
    pageName: ""
  };

  validationMessages = {
    pageName: {
      required: "Nazwa jest wymagana"
    }
  };

  popupVisible: boolean = false;

  constructor(
    private dragulaService: DragulaService,
    private CmsService: AppService,
    private event: EventService,
    private route: ActivatedRoute,
    private _route: Router,
    private PageComponent: PageComponent,
    private formBuilder: FormBuilder
  ) {
    dragulaService.drag.subscribe((value: any) => {
      this.onDrag(value.slice(1));
    });
    dragulaService.drop.subscribe((value: any) => {
      this.onUpdateLp();
      this.onDrop(value.slice(1));
    });
    dragulaService.over.subscribe((value: any) => {
      this.onOver(value.slice(1));
    });
    dragulaService.out.subscribe((value: any) => {
      this.onOut(value.slice(1));
    });

    this.event.onGetMenuList.subscribe(idParent => this.onGetMenu());
  }

  ngOnInit() {
    if (!this.idParent) this.idParent = 0;
    if (!this.idLevel) this.idLevel = 0;

    this.onGetMenu();

    this.onCreateForm();
    this.pageForm.valueChanges.subscribe(value => {
      this.event.onControlValueChanged(
        this.pageForm,
        this.formError,
        this.validationMessages
      );
    });
  }

  ngOnDestroy() {}

  onGetMenu() {
    return new Promise(resolve => {
      this.CmsService.getAuthorization(
        `page/read_menu.php?idParent=${this.idParent}&idLevel=${this.idLevel}`
      ).subscribe(response => {
        if (response != null) {
          this.menuList = response.records;
          resolve(this.menuList);
        }
      });
    });
  }

  onUpdateLp() {
    let date;
    for (let i = 0; i < this.menuList.length; i++) {
      date = JSON.stringify({
        idLevel: i + 1,
        idPage: this.menuList[i].page_id
      });
      this.CmsService.putAuthorization(
        `page/update_page_level.php`,
        date
      ).subscribe(response => {
        if (response.code !== 200) this.event.showInfo("error", "Błąd");
      });
    }
  }

  onDeletePage(id) {
    if (id == 1) this.event.showInfo("info", "Nie można usunąć strony głównej");
    else {
      this.CmsService.deleteAuthorization(
        `page/delete_page.php?id=${id}`
      ).subscribe(response => {
        if (response.code === 200) {
          this.onGetMenu();
          this.onUpdateLp();
        } else {
          this.event.showInfo("error", "Błąd");
        }
      });
    }
  }

  onLevelDown(id, idPage) {
    let date = JSON.stringify({
      idParent: this.menuList[id - 1].page_id,
      idPage: idPage
    });
    this.CmsService.putAuthorization(`page/page_node_down.php`, date).subscribe(
      response => {
        if (response.code === 200) {
          this.event.sendIdParentMenu(this.idParent);
          this.onUpdateLp();
        }
      }
    );
  }

  onLevelUp(id) {
    let date = JSON.stringify({
      idPage: id
    });

    this.CmsService.putAuthorization(`page/page_node_up.php`, date).subscribe(
      response => {
        if (response.code === 200) {
          this.event.sendIdParentMenu(this.idParent);
        }
      }
    );
  }

  onCreateForm() {
    this.pageForm = this.formBuilder.group({
      pageId: 0,
      pageName: ["", Validators.required]
    });
  }

  closeModal(){
    this.pageForm.reset();
  }

  onSendForm(event) {
    this.submitted = true;
    //stop hear if form is invalid
    if (this.pageForm.invalid) {
      this.event.onControlValueChanged(
        this.pageForm,
        this.formError,
        this.validationMessages
      );
      return;
    } else {
      this.CmsService.postAuthorization(
        `page/create_page.php`,
        event.value
      ).subscribe(response => {
        if (response.code === 200) {
          this.event.showInfo("success", "Dodano stronę");
          this.event.sendIdParentMenu(this.idParent);
          this.pageForm.reset();
          this.popupVisible = false;
          this.submitted = false;
        }
      });
    }
  }

  private onDrag(args) {
    let [e, el] = args;
    this.removeClass(e, "ex-moved");
    // do something
  }

  private onDrop(args) {
    let [e, el] = args;
    this.addClass(e, "ex-moved");
    // do something
  }

  private onOver(args) {
    let [e, el, container] = args;
    this.addClass(el, "ex-over");
    // do something
  }

  private onOut(args) {
    let [e, el, container] = args;
    this.removeClass(el, "ex-over");
    // do something
  }

  private hasClass(el: any, name: string): any {
    return new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)").test(el.className);
  }

  private addClass(el: any, name: string): void {
    if (!this.hasClass(el, name)) {
      el.className = el.className ? [el.className, name].join(" ") : name;
    }
  }

  private removeClass(el: any, name: string): void {
    if (this.hasClass(el, name)) {
      el.className = el.className.replace(
        new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)", "g"),
        ""
      );
    }
  }
}
