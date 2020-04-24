import { Component, OnInit, ElementRef } from "@angular/core";
import { AppService } from "../../app.service";
import { EventService } from "../../event.service";
import { ActivatedRoute, Router } from "@angular/router";

import { DynamicComponentComponent } from '../dynamic-component/dynamic-component.component';

import { StaticComponent } from '../../template/static/static.component';
import { NewsComponentView } from '../../template/news/news.component';
import { MapyComponent } from '../../template/mapy/mapy.component';

import { DragulaService } from "ng2-dragula";

@Component({
  selector: "app-wraper-component",
  templateUrl: "./wraper-component.component.html",
  styleUrls: ["./wraper-component.component.scss"],
  inputs:['idKontenera','idPage']
})
export class WraperComponentComponent implements OnInit {
  kontrolki = [];
  kontrolkiDoWyswietlenia = [];
  idKontenera;
  idPage;
  sub;
  constructor(
    private dragulaService: DragulaService,
    private ref: ElementRef,
    private CmsService: AppService,
    private event: EventService,
    private route: ActivatedRoute,
    private _route: Router
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
  }

  ngOnInit() {
    this.route.params.subscribe(
      params => (this.idPage = parseInt(params["id"]))
    );

    this.sub = this.route.params.subscribe(params => {
      this.idPage = +params["id"];
      if (isNaN(this.idPage)) this.idPage = 1;
      this.pobierzKontrolki(this.idPage);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  pobierzKontrolki(idPage?) {
    
    if (idPage) this.idPage = idPage;
    this.kontrolki = [];
    this.CmsService.getAuthorization(
      `page/read_container_element.php?idContainer=${this.idKontenera}&idPage=${this.idPage}`
    ).subscribe(response => {
      if (response !== null) {
        this.kontrolki = response.records;
      }
      this.wyswietlKontrolki();
    });
  }

  onDeleteElement(id) {
    this.CmsService.deleteAuthorization(
      `page/delete_page_element.php?id=${id}`
    ).subscribe(response => {
      if (response.code === 200) {
        this.event.showInfo("success", "Usunięto element");
        this.ngOnInit();
      }
    });
  }

  onUpdateLp() {
    let date;
    for (let i = 0; i < this.kontrolkiDoWyswietlenia.length; i++) {
      date = JSON.stringify({
        pageElement: this.kontrolkiDoWyswietlenia[i].pageElement,
        idLevel: i + 1,
        idKontenera: this.idKontenera
      });
      this.CmsService.putAuthorization(
        `page/update_page_el_order.php`,
        date
      ).subscribe(response => {
        if (response.code !== 200) this.event.showInfo("error", "Błąd");
      });
    }
  }

  wyswietlKontrolki() {
    this.kontrolkiDoWyswietlenia.length = 0;
    this.kontrolki.forEach((value, index) => {
      let k = null;
      switch(value.module_view_id){

         case '12': k = StaticComponent; break;
         case '1': k = NewsComponentView; break;
        // case '6': k = MenuParent; break;
         case '33': k = MapyComponent; break;
        // case '11': k = CformTemplateComponent; break;
        // case '18': k = PoolComponent; break;
        // case '10': k = GalleryComponent; break;
        // case '26': k = NewsletterComponent; break;
        // case '24': k = CalendarTemplateComponent; break;

      }

      this.kontrolkiDoWyswietlenia[index] = {
        component: k,
        idTresci: value.page_element_elemid,
        pageElement: value.page_element_id,
        order: index
      };
    });
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
