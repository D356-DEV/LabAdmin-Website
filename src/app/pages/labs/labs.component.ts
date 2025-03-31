import { Component, inject } from '@angular/core';
import { LabData } from '../../interfaces/LabInterfaces';
import { LabService } from '../../services/lab.service';
import { RouterLink } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-labs',
  imports: [ RouterLink, NgTemplateOutlet],
  templateUrl: './labs.component.html',
  styleUrl: './labs.component.css'
})
export class LabsComponent {

  labsList: LabData[] = [];
  labService: LabService = inject(LabService);

  constructor() {
    this.labService.getLabs().then((labsList: LabData[]) => {
      this.labsList = labsList;
      console.log(this.labsList);
    });
  }
}
