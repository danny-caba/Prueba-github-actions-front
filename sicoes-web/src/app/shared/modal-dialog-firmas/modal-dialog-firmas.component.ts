import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-firmas',
  templateUrl: './modal-dialog-firmas.component.html',
  styleUrls: ['./modal-dialog-firmas.component.scss']
})
export class DialogFirmasComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogFirmasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { iframeUrl: string }
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
