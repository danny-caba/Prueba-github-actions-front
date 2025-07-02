import { Directive, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { functions } from 'src/helpers/functions';
import { BaseComponent } from './base.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Directive()
export abstract class BasePageComponent<T> extends BaseComponent implements OnDestroy {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource: MatTableDataSource<T>;
  itemsTable: T[];
  isLoading: boolean = false;

  TOTAL_FACTURADO = 0;
  TOTAL_FACTURADO_EVALUADO = 0;

  ANIO = 0;
  DIA = 0;
  MES = 0;
  TOTAL_FECHA: string;
  protected onDestroy$ = new Subject<void>();

  abstract serviceTable(filtro: any);
  abstract obtenerFiltro();

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  cargarTablaInit() {
    let filtro = this.obtenerFiltro();
    filtro.page = 0;
    this.paginator._changePageSize(10);
    this.paginator.pageIndex = 0;
    filtro.size = this.paginator.pageSize ?? 10;
    this.isLoading = true;

    this.serviceTable(filtro)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(res => {
        this.itemsTable = res.content;
        this.itemsTable.length = res.totalElements; // Keep total length for paginator
        this.dataSource = new MatTableDataSource<T>(this.itemsTable);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

        this.TOTAL_FACTURADO = res.totalMonto;
        this.ANIO = res.anio;
        this.DIA = res.dia;
        this.MES = res.mes;
        this.TOTAL_FECHA = this.totalFecha();
        this.isLoading = false;
      }, (error) => {
        console.error('Error al cargar tabla inicial:', error);
        this.isLoading = false;
      });
  }

  cargarTabla() {
    let filtro = this.obtenerFiltro();
    filtro.size = this.paginator.pageSize ?? 10;
    this.isLoading = true;

    this.serviceTable(filtro)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(res => {
        this.itemsTable = res.content;
        this.itemsTable.length = res.totalElements;
        this.dataSource = new MatTableDataSource<T>(this.itemsTable);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

        this.TOTAL_FACTURADO = res.totalMonto;
        this.TOTAL_FACTURADO_EVALUADO = res.totalMontoEvaluado;
        this.ANIO = res.anio;
        this.DIA = res.dia;
        this.MES = res.mes;
        this.TOTAL_FECHA = this.totalFecha();
        this.isLoading = false;
      }, (error) => {
        console.error('Error al cargar tabla:', error);
        this.isLoading = false;
      });
  }

  totalFecha(): string {
    let msjAnio = '';
    if (this.ANIO === 1) {
      msjAnio = '1 año';
    } else if (this.ANIO > 1) {
      msjAnio = this.ANIO + ' años';
    }

    let msjMes = '';
    if (this.MES === 1) {
      msjMes = '1 mes';
    } else if (this.MES > 1) {
      msjMes = this.MES + ' meses';
    }

    let msjDias = '';
    if (this.DIA === 1) {
      msjDias = '1 día';
    } else if (this.DIA > 1) {
      msjDias = this.DIA + ' días';
    }

    let msjFinal = '';

    if (functions.noEsVacio(msjAnio)) {
      msjFinal = msjAnio;
    }

    if (functions.noEsVacio(msjMes)) {
      if (functions.noEsVacio(msjFinal)) {
        msjFinal = msjFinal + ', ' + msjMes;
      } else {
        msjFinal = msjMes;
      }
    }

    if (functions.noEsVacio(msjDias)) {
      if (functions.noEsVacio(msjFinal)) {
        msjFinal = msjFinal + ' y ' + msjDias;
      } else {
        msjFinal = msjDias;
      }
    }
    return msjFinal;
  }

  cargarTablaNoContent() {
    let filtro = this.obtenerFiltro();
    filtro.size = this.paginator.pageSize ?? 10;
    this.isLoading = true;

    this.serviceTable(filtro)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(resList => {
        this.itemsTable = resList;
        this.itemsTable.length = resList?.length;
        this.dataSource = new MatTableDataSource<T>(this.itemsTable);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      }, (error) => {
        console.error('Error al cargar tabla sin contenido:', error);
        this.isLoading = false;
      });
  }

  public iteneRegistros(): boolean {
    return this.itemsTable && this.itemsTable.length > 0;
  }

  public pageChange(event: PageEvent): void { 
    const pageIndex = event.pageIndex;
    const pageSize = event.pageSize;
    this.getNextData(pageIndex, pageSize);
  }

  private getNextData(pageIndex: number, pageSize: number): void { 
    let filtro = this.obtenerFiltro();
    filtro.size = pageSize;
    filtro.page = pageIndex;

    this.isLoading = true;
    this.serviceTable(filtro)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(res => {
        this.itemsTable = res.content;
        this.dataSource = new MatTableDataSource<T>(this.itemsTable);
        this.dataSource.sort = this.sort;
        if (this.paginator) {
            this.paginator.length = res.totalElements;
        }
        this.dataSource._updateChangeSubscription();

        this.TOTAL_FACTURADO = res.totalMonto;
        this.ANIO = res.anio;
        this.DIA = res.dia;
        this.MES = res.mes;
        this.isLoading = false;
      }, (error) => {
        console.error('Error al obtener siguientes datos:', error);
        this.isLoading = false;
      });
  }

  public getRowIndex(indexOnPage: number): number {
    return 1 + indexOnPage + this.paginator.pageIndex * this.paginator.pageSize;
  }
}