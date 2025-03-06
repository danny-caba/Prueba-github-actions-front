import { Directive, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { functions } from 'src/helpers/functions';
import { BaseComponent } from './base.component';

@Directive()
export abstract class BasePageComponent<T> extends BaseComponent{

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource: MatTableDataSource<T>;
  itemsTable: T[];
  isLoading: boolean = false;

  TOTAL_FACTURADO = 0

  ANIO = 0;
  DIA = 0;
  MES = 0;
  TOTAL_FECHA: string

  abstract serviceTable(filtro: any);
  abstract obtenerFiltro();

  cargarTablaInit(){
    let filtro = this.obtenerFiltro();
    filtro.page = 0;
    this.paginator._changePageSize(10);
    this.paginator.pageIndex = 0;
    filtro.size = this.paginator.pageSize ?? 10;
    this.serviceTable(filtro).subscribe(res => {
      this.itemsTable = res.content
      this.itemsTable.length = res.totalElements;
      this.dataSource = new MatTableDataSource<T>(this.itemsTable)
      this.dataSource.sort = this.sort
      this.dataSource.paginator = this.paginator;
      //this.dataSource.sortingDataAccessor = this.dataAceessor

      this.TOTAL_FACTURADO = res.totalMonto
      this.ANIO = res.anio
      this.DIA = res.dia
      this.MES = res.mes
      this.TOTAL_FECHA = this.totalFecha();
    })
  }

  cargarTabla(){
    let filtro = this.obtenerFiltro();
    filtro.size = this.paginator.pageSize ?? 10;
    this.serviceTable(filtro).subscribe(res => {
      this.itemsTable = res.content;
      this.itemsTable.length = res.totalElements;
      this.dataSource = new MatTableDataSource<T>(this.itemsTable)
      this.dataSource.sort = this.sort
      this.dataSource.paginator = this.paginator;
      //this.dataSource.sortingDataAccessor = this.dataAceessor

      this.TOTAL_FACTURADO = res.totalMonto
      this.ANIO = res.anio
      this.DIA = res.dia
      this.MES = res.mes
      this.TOTAL_FECHA = this.totalFecha();

    })
  }

  totalFecha(): string{
    let msjAnio = '';
    if(this.ANIO == 1){
      msjAnio = '1 año'
    }else if(this.ANIO > 1){
      msjAnio = this.ANIO + ' años';
    }

    let msjMes = '';
    if(this.MES == 1){
      msjMes = '1 mes'
    }else if(this.MES > 1){
      msjMes = this.MES + ' meses';
    }

    let msjDias = '';
    if(this.DIA == 1){
      msjDias = '1 día'
    }else if(this.DIA > 1){
      msjDias = this.DIA + ' días';
    }

    let msjFinal = ''

    if(functions.noEsVacio(msjAnio)){
      msjFinal = msjAnio;
    }

    if(functions.noEsVacio(msjMes)){
      if(functions.noEsVacio(msjFinal)){
        msjFinal = msjFinal + ', ' + msjMes;
      }else{
        msjFinal = msjMes;
      }
    }

    if(functions.noEsVacio(msjDias)){
      if(functions.noEsVacio(msjFinal)){
        msjFinal = msjFinal + ' y ' + msjDias;
      }else{
        msjFinal = msjDias;
      }
    }

    return msjFinal;
  }

  cargarTablaNoContent(){
    let filtro = this.obtenerFiltro();
    filtro.size = this.paginator.pageSize ?? 10;
    this.serviceTable(filtro).subscribe(resList => {
      this.itemsTable = resList
      this.itemsTable.length = resList?.length;
      this.dataSource = new MatTableDataSource<T>(this.itemsTable)
      this.dataSource.sort = this.sort
      this.dataSource.paginator = this.paginator;
      //this.dataSource.sortingDataAccessor = this.dataAceessor
    })
  }

  public iteneRegistros(){
    if(this.itemsTable && this.itemsTable.length > 0) return true;
    return false;
  }

  public pageChange(event: any): void {
    let pageIndex = event.pageIndex;
    let pageSize = event.pageSize;
    let previousIndex = event.previousPageIndex;
    let previousSize = pageSize * pageIndex;
    this.getNextData(previousSize, pageIndex.toString(), pageSize.toString())
  }

  private getNextData(currentSize, offset, limit): void {
    let filtro = this.obtenerFiltro();
    filtro.size = limit;
    filtro.page = offset;

    this.serviceTable(filtro).subscribe(res => {
      this.itemsTable.length = currentSize;
      this.itemsTable = res.content;
      this.dataSource = new MatTableDataSource<T>(this.itemsTable);
      //this.dataSource.sortingDataAccessor = this.dataAceessor
      this.dataSource.sort = this.sort;
      this.dataSource._updateChangeSubscription();

      this.TOTAL_FACTURADO = res.totalMonto
      this.ANIO = res.anio
      this.DIA = res.dia
      this.MES = res.mes
    })

  }

  public getRowIndex(indexOnPage: number): number {
    return 1 + indexOnPage + this.paginator.pageIndex * this.paginator.pageSize;
  }

}
