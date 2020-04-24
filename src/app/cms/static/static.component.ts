import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppService } from '../../app.service';
import { EventService } from '../../event.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-static',
  templateUrl: './static.component.html',
  styleUrls: ['./static.component.scss'],
})
export class StaticComponent implements OnInit {

  staticList;

  constructor(private CmsService: AppService, private event: EventService, private _route: Router) { }

  ngOnInit() {
      this.getStaticList();      
  }

  getStaticList(){
      this.CmsService.getAuthorization(`static/read.php`).subscribe(
        response=>{
            this.staticList = response.records;
        }
      )
  }

  onDelete(id){
    this.CmsService.deleteAuthorization(`static/delete.php?id=${id}`).subscribe(
        response=>{
            (response.code===200)?this.event.showInfo('info', 'Treść została usunięta'):this.event.showInfo('error', response.message);
            this.getStaticList();
        }
    )
  }

  onSelectionChange(event){
    this._route.navigate(['/content/', {outlets: { 'panel-outlet': ['static-add',event[0]] } }]);
  }  
}
