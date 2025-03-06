import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BasePageComponent } from 'src/app/shared/components/base-page.component';
import { ModalRequisitoComponent } from 'src/app/shared/modal-requisito/modal-requisito.component';
import { ModalSeccionComponent } from 'src/app/shared/modal-seccion/modal-seccion.component';

@Component({
  selector: 'vex-bandeja-configuraciones',
  templateUrl: './bandeja-configuraciones.component.html'
})
export class BandejaConfiguracionesComponent extends BasePageComponent<any> implements OnInit {

  dataSource2: any;
  displayedColumns2: string[] = ['tipoDato', 'descripcion', 'entrada', 'actions'];
  
  constructor(
    private dialog: MatDialog,
  ) { 
    super();
  }
  
  ngOnInit(): void {
  }

  serviceTable(filtro: any) {
    throw new Error('Method not implemented.');
  }
  obtenerFiltro() {
    throw new Error('Method not implemented.');
  }

 
  nuevoRequisito(accion: string, requisito: any = null) {
    this.dialog
      .open(ModalRequisitoComponent, {
        disableClose: true,
        width: "800px",
        maxHeight: "auto",
        data: {
          accion,
          requisito
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.cargarTabla();
          this.paginator.firstPage();
        }
      });
  }


}
