import { AfterViewInit, Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { InternalUrls, Link } from 'src/helpers/internal-urls.components';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { ProcesoItemsService } from 'src/app/service/proceso-items.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ProcesoService } from 'src/app/service/proceso.service';
import { ModalCambioEstadoItemComponent } from 'src/app/shared/modal-cambio-estado-item/modal-cambio-estado-item.component';
import { MatDialog } from '@angular/material/dialog';
import { ItemEstadoService } from 'src/app/service/item-estado.service';


@Component({
  selector: 'vex-proceso-bitacora',
  templateUrl: './proceso-bitacora.component.html',
  styleUrls: ['./proceso-bitacora.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class ProcesoBitacoraComponent extends BaseComponent implements OnInit, OnChanges, AfterViewInit {

  intenalUrls: InternalUrls;
  user$ = this.authFacade.user$;
  
  items:any = [];
  postulantes:any = [];
  dataSource: MatTableDataSource<any>;
  table: MatTable<any>;
  @ViewChild('paginator') paginator: MatPaginator;
  PROCESO: any;
  PROCESO_ITEM: any;
  valorSeleccion: number = 0;
  estadoProcesoItem:boolean = false;
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
    private itemEstadoService: ItemEstadoService,
    private dialog: MatDialog,
  ) {
    super();
  }
  displayedColumns: string[] = ['fechaHora', 'usuario', 'estadoInicial', 'estadoFinal', 'justificacion'];
  
  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource(this.postulantes);
    this.dataSource.paginator = this.paginator;
  }
  
  ngOnInit(): void {
    
    let procesoUuid = this.activeRoute.snapshot.paramMap.get('procesoUuid');
    this.procesoItemsService.buscarProcesosItems({procesoUuid: procesoUuid}).subscribe(inv => {
      this.items = inv.content;
    });
    if(procesoUuid){
      this.procesoService.obtenerProceso(procesoUuid).subscribe( resp => {
        this.PROCESO = resp;
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
        if(this.PROCESO_ITEM?.estado?.codigo == 'DESIGNACION'){
          this.estadoProcesoItem = true;
        }
      });
      this.paginator.pageIndex = 0;
      this.itemEstadoService.listarItemEstado(procesoItemUuid).subscribe(inv => {
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

  cambiarEstado(){
    this.dialog.open(ModalCambioEstadoItemComponent, {
      width: '800px',
      maxHeight: '100%',
      panelClass: 'modal-editar-etapa',
      data: {
        proceso: this.PROCESO,
        accion: 'edit',
        proceso_item: this.PROCESO_ITEM
      },
    }).afterClosed().subscribe(() => {
      this.actualizarTabla(this.PROCESO_ITEM.procesoItemUuid);
    });
  }
}

