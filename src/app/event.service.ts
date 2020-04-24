import { Injectable, Output, EventEmitter } from "@angular/core";
import notify from "devextreme/ui/notify";

declare const tinymce: any;

@Injectable({
  providedIn: "root"
})
export class EventService {
  @Output() onClosedFormGroup = new EventEmitter<boolean>();
  @Output() onAddingNewsGroup = new EventEmitter<boolean>();
  @Output()	onGetMenuList: EventEmitter<any> = new EventEmitter<any>(); 

  constructor() {}

  initTinyMce = {
    language: "pl",
    gecko_spellcheck: true,
    entity_encoding: "utf8",
    height: 500,
    plugins: [
      "advlist autolink link image lists charmap print preview hr anchor pagebreak",
      "searchreplace wordcount visualblocks visualchars insertdatetime media nonbreaking",
      "table contextmenu directionality emoticons paste textcolor responsivefilemanager code"
    ],
    toolbar1:
      "undo redo | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | styleselect",
    toolbar2:
      "| responsivefilemanager | link unlink anchor | image media | forecolor backcolor  | print preview code ",

    relative_urls: false,
    remove_script_host: false,
    convert_urls: true,
    external_filemanager_path: "filemanager/",
    filemanager_title: "RESPONSIVE FileManager",
    external_plugins: {
      filemanager: "plugins/filemanager/plugin.min.js",
      responsivefilemanager: "plugins/responsivefilemanager/plugin.min.js"
    },

    file_picker_callback: function(callback, value, meta) {
      tinymce.activeEditor.windowManager.open(
        {
          title: "Image Browser",
          url: meta.filetype
        },
        {
          oninsert: function(url) {
            callback(url);
          }
        }
      );
    }
  };

  showInfo(typ, tresc) {
    switch (typ) {
      case "info":
        notify(tresc, "info", 600);
        break;
      case "success":
        notify(tresc, "success", 600);
        break;
      case "error":
        notify(tresc, "error", 600);
        break;
    }
  }

  public sendIdParentMenu(idParent: number) {
    this.onGetMenuList.emit(idParent);
  }

  onControlValueChanged(from, formErrors, validationMsg) {
    const form = from;

    for (let field in formErrors) {
      formErrors[field] = "";
      let control = form.get(field);

      const validationMessages = validationMsg[field];
      for (const key in control.errors) {
        formErrors[field] += validationMessages[key] + " ";
      }
    }
  }
}
