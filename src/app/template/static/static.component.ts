import { Component, OnInit, ElementRef, Input, ViewChild, Output, EventEmitter, Injector,  } from '@angular/core';
import { AppService } from '../../app.service';
import { EventService } from '../../event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser'
import { PipeTransform, Pipe } from "@angular/core";



@Pipe({ name: 'safeHtml'})
export class SafeHtmlPipe implements PipeTransform  {
  constructor(private sanitized: DomSanitizer) {}
  transform(value) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}


@Component({
  selector: 'app-static',
  templateUrl: './static.component.html',
  styleUrls: ['./static.component.scss'],
})
export class StaticComponent implements OnInit {
  
  tresc;
  idtresci;
  pageElement;
  idModal;
  SettingsXML;    

  constructor(private injector: Injector, private CmsService: AppService, private route: ActivatedRoute, private _route: Router, private event: EventService) { 
      this.idtresci = this.injector.get('idTresci','');
      this.pageElement = this.injector.get('pageElement','');
  }
  
  ngOnInit() {
    this.idModal = new Date().getTime() + Math.round(Math.random() * 10000000);

     this.CmsService.get(`template/static/read_one.php?id=${this.idtresci}`).subscribe(
         response => {
            this.tresc = response.static_content;
        }
     )
  }

}
