import { Component, OnInit, ElementRef, Input, ViewChild, Output, EventEmitter, Injector } from '@angular/core';
import { AppService } from '../../app.service';
import { EventService } from '../../event.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-mapy',
  templateUrl: './mapy.component.html',
  styleUrls: ['./mapy.component.scss']
})
export class MapyComponent implements OnInit {

  idtresci;
  pageElement;
    
  markerList: any[] = [];
  public map: any = { lat: 50.40340273848367, lng: 22.30135560035683 };
    
  constructor(private injector: Injector, private CmsService: AppService, private route: ActivatedRoute, private _route: Router, private event: EventService) { 
      this.idtresci = this.injector.get('idTresci','');
      this.pageElement = this.injector.get('pageElement','');
  }

  ngOnInit() {
      this.CmsService.get(`template/map/read_group_map.php?id=${this.idtresci}`).subscribe(
        response=>{
            
            if (response != null){
                response.records.forEach(el=>{
                    this.markerList.push({
                          lat: Number(el.map_szer),
                          lng: Number(el.map_dlug),
                          draggable: false,
                          title: '',
                          description: el.map_content
                      });
                })    
                
            }
        },
          error=>{
              this.event.showInfo('error','Błąd pobierania danych');
          }
      )
  }

}
