import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { EventService } from './event.service';

import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  domanie = environment.domanie; 
  uri =  this.domanie + environment.uri;        
  sourceImageNews = this.domanie + environment.sourceImageNews;    
  uriUploudImageGallery = this.uri + environment.uriUploudImageGallery;
  uriGallery = this.domanie + environment.uriGallery;
  uriNewsImage = this.uri + environment.uriNewsImage;

  constructor(private _http:HttpClient, public event: EventService) { }

  post(uri, json){      
        return this._http.post<any[]|any>(this.uri+uri, json)
        .pipe(
          catchError((err, caught)=>{
              throw new Error(err.message)
          })
      )
    } 

    get(uri){      
      return this._http.get<any[]|any>(this.uri+uri)
      .pipe(
        map((response) => { return response}),
        catchError((err, caught)=>{
            throw new Error(err.message)
        })
      )
    } 

    deleteAuthorization(uri){
      return this._http.delete<any[]|any>(this.uri+uri,{headers: {
            'Authorizationtoken':localStorage.getItem('cmsToken')
        }})
      .pipe(
          catchError((err, caught)=>{
              throw new Error(err.message)
          })
      )
  } 

    getAuthorization(uri){
        return this._http.get<any[]|any>(this.uri+uri,{headers: {
              'Authorizationtoken':localStorage.getItem('cmsToken')
          }})
        .pipe(
            catchError((err, caught)=>{
                throw new Error(err.message)
            })
        )
    }

    postAuthorization(uri, json){      
        return this._http.post<any[]|any>(this.uri+uri, json, {headers: {
            'Authorizationtoken':localStorage.getItem('cmsToken')
        }})
        .pipe(
          catchError((err, caught)=>{
              throw new Error(err.message)
          })
        )
    }  

  putAuthorization(uri, json){      
      return this._http.put<any[]|any>(this.uri+uri, json, {headers: {
        'Authorizationtoken':localStorage.getItem('cmsToken')
      }})
      .pipe(
      catchError((err, caught)=>{
          throw new Error(err.message)
      })
      )
    }   
}
