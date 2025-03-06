import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Requisito } from 'src/app/interface/seccion.model';
import { RequisitoService } from 'src/app/service/requisito.service';
import { BasePageComponent } from 'src/app/shared/components/base-page.component';
import { ModalRequisitoComponent } from 'src/app/shared/modal-requisito/modal-requisito.component';
import { functionsAlertMod2 } from 'src/helpers/funtionsAlertMod2';

@Component({
  selector: 'vex-requisito',
  templateUrl: './requisito.component.html'
})
export class RequisitoComponent extends BasePageComponent<Requisito> implements OnInit {

  displayedColumns: string[] = ['orden', 'tipoDato', 'descripcion', 'entradaDato', 'estado', 'actions'];

  constructor(
    private dialog: MatDialog,
    private requisitoService: RequisitoService
  ) {
    super();
  }

  ngOnInit(): void {
    this.cargarTabla();
  }

  serviceTable(filtro) {
    return this.requisitoService.obtenerRequisito(filtro);
  }

  obtenerFiltro() {
    return {};
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
  
  eliminarRequisito(requisito: any) {
    const delRequisito: Requisito = {
      idSeccionRequisito: requisito.idSeccionRequisito
    };
    
    functionsAlertMod2.preguntarSiNoIcono('¿Seguro que desea eliminar el requisito?').then((result) => {
      if (result.isConfirmed) {
        this.requisitoService.eliminar(delRequisito).subscribe(() => {
          functionsAlertMod2.success('Requisito Eliminado!').then(() => {
            this.cargarTabla();
          });
        });
      }
    });
  }

}
