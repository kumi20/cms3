import { TestBed, inject } from '@angular/core/testing';
import { HttpEvent, HttpEventType } from '@angular/common/http';

import { DashboardComponent } from './dashboard.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule, HttpTestingController } from  '@angular/common/http/testing';

import { AppService } from '../app.service';
import { environment } from '../../environments/environment';

describe('DataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AppService],
      schemas:[ NO_ERRORS_SCHEMA ]
    });
  });

  it(
    'should get news',
        inject(
          [HttpTestingController, AppService],
          (httpMock: HttpTestingController, dataService: AppService) => {
            
            const mockUsers = {
              records:[{
                news_id: "155",
                news_lead_img: "http://zgk-krzeszow.pl/media/userfiles/pliki/Zdjcia.jpg",
                news_name: "ZAPRASZAMY DO WSPÓŁPRACY ODBIORCÓW SUROWCÓW WTÓRNYCH !",
                news_lead: "",
                news_views: "689",
                news_status_name: "Opublikowany",
                news_pub_date: "2014-10-31"
              }]
            };
            
            
            dataService.get('news/read.php').subscribe((event: HttpEvent<any>) => {
              
              switch (event.type) {
                case HttpEventType.Response:
                  expect(event.body).toEqual(mockUsers);
              }
            });
    
            const mockReq = httpMock.expectOne({ method: 'GET', url: 'http://127.0.0.1/restapi/news/read.php' });
    
            expect(mockReq.cancelled).toBeFalsy();
            expect(mockReq.request.responseType).toEqual('json');
            mockReq.flush(mockUsers);
            httpMock.verify();
          }
        
  ));
});