import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'survey',
  templateUrl: './survey.template.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit {
  showSurvey: boolean;

  ngOnInit() {
    setTimeout(() => {
      // increase the threshold to 1
      // to see the survey always popup
      if (Math.random() < 0.1) {
        this.showSurvey = true;
      }
    }, 20);
  }

  closeSurvey() {
    this.showSurvey = false;
  }
}
