import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BasePageComponent } from 'src/app/shared/components/base-page.component';
import { ModalSeccionComponent } from 'src/app/shared/modal-seccion/modal-seccion.component';
import { SeccionService } from '../../../../service/seccion.service';
import { functionsAlertMod2 } from 'src/helpers/funtionsAlertMod2';
import { Seccion } from 'src/app/interface/seccion.model';

@Component({
  selector: 'vex-seccion',
  templateUrl: './seccion.component.html'
})
export class SeccionComponent extends BasePageComponent<Seccion> implements OnInit {
  
  displayedColumns: string[] = ['orden', 'descripcion', 'personal', 'estado', 'actions'];

  constructor(
    private dialog: MatDialog,
    private seccionService: SeccionService
  ) {
    super();
  }

  ngOnInit(): void {
    this.cargarTabla();
  }

  serviceTable(filtro) {
    return this.seccionService.obtenerSeccion(filtro);
  }

  obtenerFiltro() {
    return {};
  }

  nuevaSeccion(accion: string, seccion: any = null) {
    this.dialog
      .open(ModalSeccionComponent, {
        disableClose: true,
        width: "800px",
        maxHeight: "auto",
        data: {
          accion,
          seccion
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
  
  eliminarSeccion(seccion: any) {
    const delSeccion: Seccion = {
      idSeccion: seccion.idSeccion
    };
    console.log(delSeccion);
    
    functionsAlertMod2.preguntarSiNoIcono('¿Seguro que desea eliminar la consulta?').then((result) => {
      if (result.isConfirmed) {
        this.seccionService.eliminar(delSeccion).subscribe(() => {
          functionsAlertMod2.success('Consulta Eliminada').then(() => {
            this.cargarTabla();
          });
        });
      }
    });
  }

}
