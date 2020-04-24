import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { EventService } from '../event.service'; 
 
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  newsList = [];

  constructor(private appService: AppService, private eventService: EventService) { }

  ngOnInit() {
  }
}
