import { CommonModule } from '@angular/common';
import { Component, Inject, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';



@Component({
  selector: 'app-modal-informativo',
  templateUrl: './modal-informativo.component.html',
  styleUrls: ['./modal-informativo.component.scss']
})
export class ModalInformativoComponent implements OnInit {
  
  description: string =  "";
  titleConfirm: string = "";
  title:string="";
  config:any;

  constructor(private dialogRef: MatDialogRef<ModalInformativoComponent>,
    @Inject(MAT_DIALOG_DATA) data,
  ) { 
    this.config=data;
  }

  ngOnInit() {
    this.title = this.config.title || "Mensaje Informativo";
    this.description = this.config.description;
    this.titleConfirm = this.config.titleConfirm ;
  }

  protected closeModalReject(): void {
    this.dialogRef.close(false);
  }

  protected closeModalConfirm(): void {
    this.dialogRef.close(true);
  }

}
