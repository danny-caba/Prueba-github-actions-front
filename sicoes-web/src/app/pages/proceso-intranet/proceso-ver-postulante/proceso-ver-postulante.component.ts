import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { InternalUrls, Link } from 'src/helpers/internal-urls.components';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { ProcesoItemsService } from 'src/app/service/proceso-items.service';
import { PropuestaService } from 'src/app/service/propuesta.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ProcesoService } from 'src/app/service/proceso.service';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { functionsAlertMod2 } from 'src/helpers/funtionsAlertMod2';
import { AdjuntosService } from 'src/app/service/adjuntos.service';
import { functions } from 'src/helpers/functions';


@Component({
  selector: 'vex-proceso-ver-postulante',
  templateUrl: './proceso-ver-postulante.component.html',
  styleUrls: ['./proceso-ver-postulante.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class ProcesoVerPostulanteComponent extends BaseComponent implements OnInit, OnChanges {

  intenalUrls: InternalUrls;
  user$ = this.authFacade.user$;
  
  items:any = [];
  postulantes:any = [];
  dataSource: MatTableDataSource<any>;
  table: MatTable<any>;
  paginator: MatPaginator;
  PROCESO: any;
  PROCESO_ITEM: any;
  valorSeleccion: number = 0;
  textoBusqueda:string = '';

  formGroup = this.fb.group({
    item: [null],
  });
  constructor(
    private authFacade: AuthFacade,
    private activeRoute: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private procesoService: ProcesoService,
    private procesoItemsService: ProcesoItemsService,
    private propuestaService: PropuestaService,
    private adjuntoService: AdjuntosService,
  ) {
    super();
  }
  displayedColumns: string[] = ['fechaHora', 'tipoPersona', 'pais', 'persona', 'item', 'consorcio', 'monto', 'seleccionarGanador', 'acciones'];
  
  ngOnInit(): void {
    //let idPropuestaProfesional = this.activeRoute.snapshot.paramMap.get('idPropuestaProfesional');
    
    let procesoUuid = this.activeRoute.snapshot.paramMap.get('procesoUuid');
    this.procesoItemsService.buscarProcesosItems({procesoUuid: procesoUuid}).subscribe(inv => {
      this.items = inv.content;
    });
    if(procesoUuid){
      this.procesoService.obtenerProceso(procesoUuid).subscribe( resp => {
        this.PROCESO = resp;
        /*if(this.PROCESO?.estado?.codigo == 'DESIGNACION'){
          this.estadoProceso = true;
        }*/
      })
    }

    this.formGroup.controls.item.valueChanges.subscribe(value => {
      this.buscarPrcocesoItem();
    })
  }

  ngOnChanges(changes: SimpleChanges): void {

  }


  cancelar(){
    this.router.navigate([Link.INTRANET, Link.PROCESOS_LIST]);
  }

  buscarPrcocesoItem(){
    const procesoItemUuid = this.formGroup.controls.item.value.procesoItemUuid;
    this.actualizarTabla(procesoItemUuid);
  }

  actualizarTabla(procesoItemUuid){
    if(procesoItemUuid){
      this.valorSeleccion = 0;
      this.procesoItemsService.obtenerProcesoItems(procesoItemUuid).subscribe(res => {
        this.PROCESO_ITEM = res;
      });
      this.propuestaService.listarPostulantes(procesoItemUuid).subscribe(inv => {
        this.postulantes = inv.content;
        this.dataSource = new MatTableDataSource(this.postulantes);
        this.dataSource.paginator = this.paginator;
        this.table?.renderRows();
        const cantidadResultado = Object.keys(this.postulantes).length;
        if(cantidadResultado > 0){
          this.textoBusqueda = `${cantidadResultado}`;
        }else{
          this.textoBusqueda = 'No hay resultados'
        }
      });
    }
  }

  sleccionarGanador(evento, postulanteGanador){
    let mensaje = "¿Estas seguro de quitar al postor " + postulanteGanador?.supervisora?.nombreRazonSocial + "como empresa ganadora del N° de proceso "+this.PROCESO?.numeroProceso + "?";
    if(evento != null && evento.value == "0"){
      mensaje = "¿Estas seguro de seleccionar a " + postulanteGanador?.supervisora?.nombreRazonSocial + "como empresa ganadora del N° de proceso "+this.PROCESO?.numeroProceso + "?";
    }else if(evento != null && evento.value == "2"){
      mensaje = "¿Estas seguro de cambiar a " + postulanteGanador?.supervisora?.nombreRazonSocial + "como empresa ganadora del N° de proceso "+this.PROCESO?.numeroProceso + "?";
    }
    const propuestaUuid = postulanteGanador?.propuestaUuid;        
    if(propuestaUuid && mensaje != ""){
      functionsAlertMod2.preguntarSiNo(mensaje, 'Sí, seleccionar').then((result) => {
        if (result.isConfirmed) {
          this.propuestaService.seleccionarGanador(postulanteGanador, propuestaUuid).subscribe({
            next: (resp) => {
              functionsAlertMod2.success('Actualizado con éxito').then((result) => {
                const procesoItemUuid = this.formGroup.controls.item.value.procesoItemUuid;
                this.actualizarTabla(procesoItemUuid);
              });
            },
            error: (e) => {
              evento.source.checked = false;
            }
          }
          );
        }else{
          if(evento != null){
            evento.source.checked = false;
          }
        }
      });
    }

  }

  descargarResumen(){
    this.adjuntoService.downloadResumenProcesoItem(this.PROCESO_ITEM.procesoItemUuid, "Resumen_empresas_postulantes.xlsx");
  }

  tipoSeleccion(){
    this.valorSeleccion = 2;
    return 1;
  }

  verResumenPostulante(obj){
    this.router.navigate([Link.INTRANET, Link.PROCESOS_LIST, Link.PROCESOS_PROPUESTA_RESUMEN, obj?.propuestaUuid]);
  }

  generarDescargaPropuesta(row){
    if(functions.esVacio(row.decripcionDescarga)){
      this.propuestaService.generarPropuetaZip({}, row.propuestaUuid).subscribe(res =>{
        this.buscarPrcocesoItem();
      });
    }
    
    if(row.decripcionDescarga == 'Descargando Archivos' || row.decripcionDescarga == 'Generando Zip'){
      functionsAlertMod2.success('La Generación de Archivo se encuentra en procesos, favor de validar en unos minutos');
      this.buscarPrcocesoItem();
    }

    if(row.decripcionDescarga == 'Descargar'){
      this.adjuntoService.downloadPropuestaZip(row.propuestaUuid, "propuesta.zip");
    }
  }

  async generarDescargaProcesoItemsZip(){
    if(functions.esVacio(this.PROCESO_ITEM?.decripcionDescarga)){
      this.procesoItemsService.generaProcesoItemsZip({}, this.PROCESO_ITEM?.procesoItemUuid).subscribe(res =>{
        this.buscarPrcocesoItem();
      });
    }
    if(this.PROCESO_ITEM.decripcionDescarga == 'Descargando Archivos' || this.PROCESO_ITEM.decripcionDescarga == 'Generando Zip'){
      this.buscarPrcocesoItem();
      functionsAlertMod2.success('La Generación de Archivo se encuentra en procesos, favor de validar en unos minutos');
    }
    if(this.PROCESO_ITEM.decripcionDescarga == 'Descargar'){
      this.adjuntoService.downloadProcesoItemZip(this.PROCESO_ITEM.procesoItemUuid, "proceso-item.zip");
    }
  }

}

