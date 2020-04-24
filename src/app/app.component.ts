import { Component, OnInit } from '@angular/core';

import { locale, loadMessages, formatMessage } from "devextreme/localization";

import plMessages from "../assets/devextreme/localization/messages/pl.json"
import notify from 'devextreme/ui/notify';

declare var window: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  locale: string;
	locales = [{
				"Name": "English",
				"Value": "en"
			}, 
			{
				"Name": "Polski",
				"Value": "pl"
			}];
  formatMessage = formatMessage;
  
  constructor(){}
    
   ngOnInit(){
      this.locale = this.getLocale();
      this.initMessages();
      locale(this.locale);
      window.tinyMCE.overrideDefaults({
			base_url: '/assets/tinymce/',  
		  });
   }

   setLocale(locale) {
        sessionStorage.setItem("locale", locale);
    }

    changeLocale(data) {
        this.setLocale(data.value);
        parent.document.location.reload();
    }

    initMessages() {
        loadMessages(plMessages);
    }

    getLocale() {
        var locale = sessionStorage.getItem("locale");
        return locale != null ? locale : "pl";
    }
}
