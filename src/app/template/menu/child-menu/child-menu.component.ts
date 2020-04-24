import { Component, OnInit, ElementRef, Input, ViewChild, Output, EventEmitter, Injector } from '@angular/core';
import { AppService } from '../../../app.service';
import { EventService } from '../../../event.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-child-menu',
  templateUrl: './child-menu.component.html',
  styleUrls: ['./child-menu.component.scss']
})
export class ChildMenuComponent implements OnInit {
  
  parent;
  level;
  submenu;
  idtresci;
  pageElement
    
  constructor(private injector: Injector, private CmsService: AppService, private route: ActivatedRoute, private _route: Router, private event: EventService) { 
      this.idtresci = this.injector.get('idTresci','');
      this.pageElement = this.injector.get('pageElement','');
  }

  ngOnInit() {
      this.CmsService.get(`template/menu/getParent.php?id=${this.idtresci}&node=${this.level}&parent=${this.parent}`).subscribe(
        response =>{
            if(response != null) this.submenu = response;
        },
          error=>{
              this.event.showInfo('error', 'Błąd pobierania danych');
          }
      )
  }

}
