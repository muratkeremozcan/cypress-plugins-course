import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'settings',
  templateUrl: './settings.template.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  showSettings: boolean;

  ngOnInit() {
    this.showSettings = false;
  }

  toggleSettings() {
    this.showSettings = !this.showSettings;
  }
}
