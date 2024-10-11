import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { MatDialogRef } from '@angular/material/dialog';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { BaseComponent } from '../components/base.component';

@Component({
  selector: 'vex-modal-info-nro-proceso',
  templateUrl: './modal-info-nro-proceso.component.html',
  styleUrls: ['./modal-info-nro-proceso.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class ModalInfoNroProcesoComponent extends BaseComponent implements OnInit {


  constructor(
    private dialogRef: MatDialogRef<ModalInfoNroProcesoComponent>,
  ) {
    super();
  }

  ngOnInit(): void {
    
  }

  closeModal() {
    this.dialogRef.close();
  }
}
