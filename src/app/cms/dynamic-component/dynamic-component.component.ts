import { ViewContainerRef, Component, Injector, ComponentFactoryResolver, ComponentRef, ReflectiveInjector, ViewChild, Input, OnInit} from '@angular/core';

import { StaticComponent } from '../../template/static/static.component'
import { NewsComponentView } from '../../template/news/news.component';
import { MapyComponent } from '../../template/mapy/mapy.component';
// import { MenuParent } from '../template/menu/menu/menu.component';
// import { MapyComponent } from '../template/mapy/mapy.component';
// import { CformTemplateComponent } from '../template/cform/cform.component';
// import { PoolComponent } from '../template/pool/pool.component';
// import { GalleryComponent } from '../template/gallery/gallery.component';
// import { NewsletterComponent } from '../template/newsletter/newsletter.component';
// import { CalendarTemplateComponent } from '../template/calendar/calendar.component';

@Component({
  selector: 'app-dynamic-component',
  entryComponents:[
     StaticComponent,
     NewsComponentView,
     MapyComponent
    // MenuParent,
    // MapyComponent,
    // CformTemplateComponent,
    // PoolComponent,
    // GalleryComponent,
    // NewsletterComponent,
    // CalendarTemplateComponent
  ],
  templateUrl: './dynamic-component.component.html',
  styleUrls: ['./dynamic-component.component.scss']
})
export class DynamicComponentComponent implements OnInit {

  @ViewChild('dynamicComponentContainer', {static: true, read: ViewContainerRef}) dynamicComponentContainer;
  @Input() componentData; 
    
  injector: Injector;


  constructor(private componentFactoryResolver: ComponentFactoryResolver, viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
    this.injector = ReflectiveInjector.resolveAndCreate([
      {
        provide: 'idTresci',
        useValue: {
          value: this.componentData.idTresci
        }
      },
      {
        provide: 'pageElement',
        useValue: {
          value: this.componentData.pageElement
        }
      }  
    ]);   
    const factory = this.componentFactoryResolver.resolveComponentFactory(this.componentData.component);
    const componentRef = this.dynamicComponentContainer.createComponent(factory, 0 , this.injector);
    componentRef.instance.idtresci = this.componentData.idTresci;
    componentRef.instance.pageElement = this.componentData.pageElement;
    //componentRef.instance.callMeFromParent;
    componentRef.changeDetectorRef.detectChanges();
  }

}
