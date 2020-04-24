import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../../app.service';
import { EventService } from '../../event.service';

import { DxDrawerComponent, DxTemplateHost} from 'devextreme-angular';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  @ViewChild(DxDrawerComponent, { static: false }) drawer: DxDrawerComponent;
  navigation: [];
  menuList: [];
  showSubmenuModes: string[] = ['slide', 'expand'];
  positionModes: string[] = ['left', 'right'];
  showModes: string[] = ['push', 'shrink', 'overlap'];
  text: string;
  selectedOpenMode: string = 'shrink';
  selectedPosition: string = 'left';
  selectedRevealMode: string = 'slide';
  elementAttr: any;
  
  toolbarContent = [{
    widget: 'dxButton',
    location: 'before',
    options: {
        icon: 'menu',
        onClick: () => this.drawer.instance.toggle()
    }
}];

  constructor(private CmsService: AppService, private event: EventService, private route: ActivatedRoute, private _route: Router) { 
    this.getMenuList();
  }

  ngOnInit() {
    
    
  }

  getMenuList(){
    this.CmsService.getAuthorization(`module/read.php`).subscribe(response=>{
        this.menuList = response.records;
        //this.menuList[0].icon = 'envelope';
    });
    
  }

  
  onSelectionChanged(event){
      this._route.navigate(['/content/', {outlets: { 'panel-outlet': [event.itemData.name] } }])
      this.drawer.opened = false;
  }
}
