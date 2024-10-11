import { Injectable } from "@angular/core";
import { MatDialogRef, MatDialog } from "@angular/material/dialog";
import { BehaviorSubject } from "rxjs";
import { LoadingDialogComponent } from "src/app/shared-app/loagind-dialog/loading-dialog.component";
import { environment } from "src/environments/environment";

@Injectable()
export class LoadingDialogService {

  loadingSub: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loadingMap: Map<string, boolean> = new Map<string, boolean>();

  private opened = false;
  private dialogRef: MatDialogRef<LoadingDialogComponent>;

  constructor(private dialog: MatDialog) {
    
  }

  openDialog(): void {
    if (!this.opened) {
      this.opened = true;
      this.dialogRef = this.dialog.open(LoadingDialogComponent, {
        data: undefined,
        maxHeight: "100%",
        width: "400px",
        maxWidth: "100%",
        disableClose: true,
        hasBackdrop: true,
        panelClass: 'custon-modalBox'
      });

      this.dialogRef.afterClosed().subscribe(() => {
        this.opened = false;
      });
    }
  }

  hideDialog() {
    this.dialogRef?.close();
  }

  setLoading(loading: boolean, url: string): void {
    if(!url.startsWith(environment.pathServe)){
      return;
    }
    /*if(url.includes('expediente-siged')){
      loading = false;
    }*/
    if (!url) {
      throw new Error('The request URL must be provided to the LoadingService.setLoading function');
    }
    if (loading === true) {
      this.loadingMap.set(url, loading);
      this.loadingSub.next(true);
    }else if (loading === false && this.loadingMap.has(url)) {
      this.loadingMap.delete(url);
    }
    if (this.loadingMap.size === 0) {
      this.loadingSub.next(false);
    }
  }
}
