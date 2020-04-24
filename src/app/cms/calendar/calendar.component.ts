import { Component, OnInit } from "@angular/core";

import { EventService } from "../../event.service";
import { AppService } from "../../app.service";
import { ActivatedRoute, Router } from "@angular/router";

import plLocale from '@fullcalendar/core/locales/pl';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl
} from "@angular/forms";

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.scss"]
})
export class CalendarComponent implements OnInit {
  calendarEvents = [];
  calendarPlugins: any; // important!
  locales = [plLocale];
  formEvent;

  formError = {
    eventStart: "",
    eventEnd: "",
    eventTitle: ""
  };

  validationMessages = {
    eventStart: {
      required: "Data startu jest wymagana"
    },
    eventEnd: {
      required: "Data końca jest wymagana"
    },
    eventTitle: {
      required: "Nazwa jest wymagana"
    }
  };

  submitted: boolean = false;
  popupVisible: boolean = false;

  constructor(
    private CmsService: AppService,
    private event: EventService,
    private route: ActivatedRoute,
    private _route: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.calendarPlugins = {
      editable: true,
      timeZone: "local",
      theme: "standart", // default view, may be bootstrap
      header: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth"
        // right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      plugins: [dayGridPlugin, interactionPlugin]
    };

    this.onGetEventList();
    this.onCreateForm();

    this.formEvent.valueChanges.subscribe(value => {
      this.event.onControlValueChanged(
        this.formEvent,
        this.formError,
        this.validationMessages
      );
    });
  }

  onCreateForm() {
    this.formEvent = this.formBuilder.group({
      eventId: 0,
      eventStart: ["", Validators.required],
      eventEnd: ["", Validators.required],
      eventTitle: ["", Validators.required]
    });
  }

  onSubmitedEventForm(event) {
    this.submitted = true;
    if (this.formEvent.invalid) {
      this.event.onControlValueChanged(
        this.formEvent,
        this.formError,
        this.validationMessages
      );
      return;
    } else {
      if (event.value.eventId != 0) {
        this.CmsService.putAuthorization(
          `callendar/update.php`,
          event.value
        ).subscribe(response => {
          if (response.code === 200) {
            this.formEvent.reset();
            this.event.showInfo("success", "Zaktualizowano wydarzenie");
            this.submitted = false;
            this.popupVisible = false;
            this.onGetEventList();
          }
        });
      } else {
        this.CmsService.postAuthorization(
          `callendar/create.php`,
          event.value
        ).subscribe(response => {
          if (response.code === 200) {
            this.formEvent.reset();
            this.submitted = false;
            this.popupVisible = false;
            this.event.showInfo("success", "Dodano wydarzenie");
            this.onGetEventList();
          }
        });
      }
    }
  }

  onGetEventList() {
    this.CmsService.getAuthorization(`callendar/read_events.php`).subscribe(
      respnose => {
        this.calendarEvents = respnose.records;
      }
    );
  }

  handleDateClick(event) {
    this.popupVisible = true;
    this.CmsService.getAuthorization(
      `callendar/read_one_event.php?id=${event.event.id}`
    ).subscribe(response => {
      this.formEvent.controls["eventId"].setValue(Number(response.id));
      this.formEvent.controls["eventStart"].setValue(response.start);
      this.formEvent.controls["eventEnd"].setValue(response.end);
      this.formEvent.controls["eventTitle"].setValue(response.title);
    });
  }

  dateClick(event) {
    this.popupVisible = true;
    this.formEvent.controls["eventStart"].setValue(event.dateStr);
    this.formEvent.controls["eventEnd"].setValue(event.dateStr);
  }

  onDeleteEvent() {
    this.CmsService.deleteAuthorization(
      `callendar/delete.php?id=${this.formEvent.controls["eventId"].value}`
    ).subscribe(response => {
      if (response.code === 200) {
        this.event.showInfo("success", "Usunięto wydarzenie");
        this.formEvent.reset();
        this.popupVisible = false;
        this.onGetEventList();
      }
    });
  }

  closeModal(){
    console.log("yyyyy")
    this.formEvent.reset();
  }
}
