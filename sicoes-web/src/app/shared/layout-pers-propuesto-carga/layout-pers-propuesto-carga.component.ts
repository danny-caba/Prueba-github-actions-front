import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '../components/base.component';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';

@Component({
  selector: 'vex-layout-pers-propuesto-carga',
  templateUrl: './layout-pers-propuesto-carga.component.html',
  styleUrls: ['./layout-pers-propuesto-carga.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class LayoutPersPropuestoCargaComponent extends BaseComponent implements OnInit {

  @Input() isReview?: boolean;

  editable: boolean = true;
  marcacionContratoLab: 'si' | 'no' | null = null;
  marcacionScrt: 'si' | 'no' | null = null;
  marcacionPoliza: 'si' | 'no' | null = null;
  marcacionExMed: 'si' | 'no' | null = null;

  templates = [
    {
      label: 'Contrato Laboral',
      files: ['ContrMock.pdf'],
      fileCount: 1,
      radioValue: this.marcacionContratoLab
    },
    {
      label: 'SCTR',
      files: ['SCRT1Mock.pdf', 'SCRT2Mock.pdf'],
      fileCount: 2,
      radioValue: this.marcacionScrt
    },
    {
      label: 'Póliza',
      files: ['Pol1Mock.pdf', 'Pol2Mock.pdf'],
      fileCount: 2,
      radioValue: this.marcacionPoliza
    },
    {
      label: 'Examen Médico',
      files: ['ExaMock.pdf'],
      fileCount: 1,
      radioValue: this.marcacionExMed
    }
  ];
  

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.isReview =this.isReview ?? false;
    console.log("isReview -> ", this.isReview);
  }

  setValueCheckedContratoLab(even) {
  }

}