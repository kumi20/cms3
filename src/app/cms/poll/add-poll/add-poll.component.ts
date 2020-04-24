import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AppService } from "../../../app.service";
import { EventService } from "../../../event.service";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl
} from "@angular/forms";
import { DatePipe } from "@angular/common";
import { ɵangular_packages_platform_browser_platform_browser_l } from "@angular/platform-browser";

@Component({
  selector: "app-add-poll",
  templateUrl: "./add-poll.component.html",
  styleUrls: ["./add-poll.component.scss"]
})
export class AddPollComponent implements OnInit, OnDestroy {
  pollForm;

  formError = {
    pollName: "",
    pollStartDate: "",
    pollEndDate: ""
  };

  validationMessages = {
    pollName: {
      required: "Tytuł jest wymagana"
    },
    pollStartDate: {
      required: "Data startu jest wymagana"
    },
    pollEndDate: {
      required: "Data końca jest wymagana"
    }
  };

  submitted: boolean = false;

  idPoll;
  idPollSubscribe;

  constructor(
    private CmsService: AppService,
    private event: EventService,
    private route: ActivatedRoute,
    private _route: Router,
    public formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.onCreateForm();

    this.idPollSubscribe = this.route.params.subscribe(
      params => (this.idPoll = parseInt(params["id"]))
    );

    if (!isNaN(this.idPoll)) {
      this.setDataPoll();
    }

    this.pollForm.valueChanges.subscribe(value => {
      this.event.onControlValueChanged(
        this.pollForm,
        this.formError,
        this.validationMessages
      );
    });
  }

  ngOnDestroy() {
    this.idPollSubscribe.unsubscribe();
  }

  onCreateForm() {
    this.pollForm = this.formBuilder.group({
      pollId: 0,
      pollName: ["", Validators.required],
      pollStartDate: ["", Validators.required],
      pollEndDate: ["", Validators.required],
      pollVoteList: this.formBuilder.array([])
    });
  }

  onValueChanged() {
    new DatePipe("en-US").transform(this.pollForm.get("pollStartDate").value)
      ? this.pollForm.controls.pollStartDate.setValue(
          new DatePipe("en-US").transform(
            this.pollForm.get("pollStartDate").value,
            "yyyy-MM-dd"
          )
        )
      : this.pollForm.controls.pollStartDate.setValue("");

    new DatePipe("en-US").transform(this.pollForm.get("pollEndDate").value)
      ? this.pollForm.controls.pollEndDate.setValue(
          new DatePipe("en-US").transform(
            this.pollForm.get("pollEndDate").value,
            "yyyy-MM-dd"
          )
        )
      : this.pollForm.controls.pollEndDate.setValue("");
  }

  onAddingVote() {
    this.pollForm.get("pollVoteList").push(
      this.formBuilder.group({
        poll_vote_id: 0,
        pool_vote_name: "",
        pool_procent: 0,
        poll_vote_votecount: 0
      })
    );
  }

  onSubmitedForm(value) {
    this.submitted = true;
    if (this.pollForm.invalid) {
      this.event.onControlValueChanged(
        this.pollForm,
        this.formError,
        this.validationMessages
      );
      return;
    } else {
      if (value.pollId === 0) {
        this.CmsService.postAuthorization(`poll/create.php`, value).subscribe(
          response => {
            if (response.code === 200) {
              this.pollForm.controls.pollId.setValue(response.idPoll);
              this.pollForm.get("pollVoteList").value.forEach(field => {
                if (field.poll_vote_id == 0) {
                  this.CmsService.postAuthorization(
                    `poll/create_question.php?id=${this.pollForm.controls.pollId.value}`,
                    field
                  ).subscribe(response => {
                    if (response.code !== 200)
                      this.event.showInfo("error", "Błąd dodawania pytania");
                  });
                } else {
                  this.CmsService.putAuthorization(
                    `poll/update_question.php`,
                    field
                  ).subscribe(response => {
                    if (response.code !== 200)
                      this.event.showInfo("error", "Błąd dodawania pytania");
                  });
                }
              });

              this.event.showInfo("success", "Dodano sondę");
              this._route.navigate([
                "/content/",
                { outlets: { "panel-outlet": ["poll"] } }
              ]);
              this.submitted = false;
            }
          }
        );
      } else {
        this.CmsService.putAuthorization(`poll/update.php`, value).subscribe(
          response => {
            if (response.code === 200) {
              this.pollForm.get("pollVoteList").value.forEach(field => {
                if (field.poll_vote_id == 0) {
                  this.CmsService.postAuthorization(
                    `poll/create_question.php?id=${this.pollForm.controls.pollId.value}`,
                    field
                  ).subscribe(response => {
                    if (response.code !== 200)
                      this.event.showInfo("error", "Błąd dodawania pytania");
                  });
                } else {
                  this.CmsService.putAuthorization(
                    `poll/update_question.php`,
                    field
                  ).subscribe(response => {
                    if (response.code !== 200)
                      this.event.showInfo("error", "Błąd dodawania pytania");
                  });
                }
              });
              this.event.showInfo("success", "Dodano sondę");
              this._route.navigate([
                "/content/",
                { outlets: { "panel-outlet": ["poll"] } }
              ]);
              this.submitted = false;
            }
          }
        );
      }
    }
  }

  onDeleteVote(id) {
    if (this.pollForm.get("pollVoteList").value[id].poll_vote_id != 0) {
      this.CmsService.deleteAuthorization(
        `poll/delete_vote.php?id=${
          this.pollForm.get("pollVoteList").value[id].poll_vote_id
        }`
      ).subscribe(response => {
        if (response.code === 200)
          this.event.showInfo("info", "Usunięto odpowiedź");
      });
    }
    this.pollForm.get("pollVoteList").removeAt(id, 1);
  }

  setDataPoll(){
    this.CmsService.getAuthorization(
      `poll/read_one.php?id=${this.idPoll}`
    ).subscribe(response => {
      if (response.code === 200) {
        this.pollForm.patchValue({
          pollId: response.records[0].poll_id,
          pollName: response.records[0].poll_name,
          pollStartDate: response.records[0].poll_startdate,
          pollEndDate: response.records[0].poll_enddate
        });

        response.records.forEach(items => {
          this.pollForm.get("pollVoteList").push(
            this.formBuilder.group({
              poll_vote_id: items.poll_vote_id,
              pool_vote_name: items.poll_vote_name,
              pool_procent:
                Number(items.poll_vote_votecount / response.records.length) *
                100,
              poll_vote_votecount: items.poll_vote_votecount
            })
          );
        });
      }
    });
  }
}
