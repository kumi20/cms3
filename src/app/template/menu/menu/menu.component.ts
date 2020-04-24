import { Component, OnInit, ElementRef, Input, ViewChild, Output, EventEmitter, Injector } from '@angular/core';
import { AppService } from '../../../app.service';
import { EventService } from '../../../event.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuParent implements OnInit {

  tresc;
  idtresci;
  pageElement;
  idModal;
  menu;    
    
  constructor(private injector: Injector, private CmsService: AppService, private route: ActivatedRoute, private _route: Router, private event: EventService) { 
      this.idtresci = this.injector.get('idTresci','');
      this.pageElement = this.injector.get('pageElement','');
  }

  ngOnInit() {
      this.CmsService.get(`template/menu/getParent.php?id=${this.idtresci}&node=0&parent=0`).subscribe(
        response =>{
            if(response != null) this.menu = response;
        },
          error=>{
              this.event.showInfo('error', 'Błąd pobierania danych');
          }
      )
  }

}
