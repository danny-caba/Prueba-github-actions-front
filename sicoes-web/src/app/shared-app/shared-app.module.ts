import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LoadingDialogService } from 'src/helpers/loading';
import { LoadingDialogComponent } from './loagind-dialog/loading-dialog.component';

const sharedAppComponents = [
    LoadingDialogComponent
];

@NgModule({
    imports:      [ CommonModule, FormsModule, MatDialogModule, MatProgressSpinnerModule, MatSnackBarModule, ReactiveFormsModule],
    declarations: [ ...sharedAppComponents ],
    exports:      [ ...sharedAppComponents, CommonModule, FormsModule, ReactiveFormsModule ],
    providers:    [ LoadingDialogService ],
    entryComponents: [...sharedAppComponents]
})
export class SharedAppModule { }