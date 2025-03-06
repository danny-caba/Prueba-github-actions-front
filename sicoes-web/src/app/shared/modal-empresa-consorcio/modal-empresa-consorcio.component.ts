import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from "../components/base.component";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { PropuestaConsorcioService } from 'src/app/service/propuesta-consorcio.service';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { Supervisora } from 'src/app/interface/supervisora.model';

@Component({
    selector: 'vex-modal-empresa-consorcio',
    templateUrl: './modal-empresa-consorcio.component.html',
    styleUrls: ['./modal-empresa-consorcio.component.scss']
  })
export class ModalEmpresaConsorcio extends BaseComponent implements OnInit {

    empresasFiltradas: Observable<any[]>;
    autocompletado = false;
    public dataSourceTotal = new MatTableDataSource<any>();
    private originalData: any[];
    propuestaConsorcio: any;
    propuestaTecnica: any;
    firstSupervisora: Supervisora;
    supervisora: Supervisora;
    primerRegistro: boolean;
    sector: number;
    empresasRegistradas: any[];
    empresaSeleccionada: String;

    formGroup = this.fb.group({
        empresas: [''],
      });

    constructor(
        private dialogRef: MatDialogRef<ModalEmpresaConsorcio>,
        @Inject(MAT_DIALOG_DATA) data,
        private fb: FormBuilder,
        private propuestaConsorcioService: PropuestaConsorcioService
    ) {
        super();
        this.dataSourceTotal.data = data.empresas;
        this.propuestaTecnica = data.propuestaTecnica;
        this.firstSupervisora = data.supervisora;
        this.primerRegistro = data.primerRegistro;
        this.sector = data.sector;
    }

    ngOnInit() {
        this.originalData =  this.dataSourceTotal.data;
        this.propuestaConsorcioService.obtenerEmpresasConsorcio(this.propuestaTecnica.idPropuestaTecnica, this.sector).subscribe(resp => {
            this.empresasRegistradas = resp;
            this.empresasFiltradas = this.formGroup.controls.empresas.valueChanges.pipe(
                startWith(''), // Empezar con una cadena vacía
                map(value => this._filterUsuarios(value))
            );
        });
    }

    closeModal() {
        this.dialogRef.close();
    }

    private _filterUsuarios(value: string): any[] {

        const filterValue = value.toLowerCase();

        //Retira del listado la empresa principal
        this.originalData = this.originalData.filter(item => item.idSupervisora != this.firstSupervisora.idSupervisora);
        if (this.empresasRegistradas) {
            for (let empresa of this.empresasRegistradas) {
                this.originalData = this.originalData.filter(item => item.idSupervisora != empresa.supervisora.idSupervisora);
            }
        }

        if (filterValue.trim() === '') {
            this.dataSourceTotal.data = this.originalData;
            return this.dataSourceTotal.data;
        } else {
            this.dataSourceTotal.data = this.originalData.filter(item => {
                const empresa = item.nombreRazonSocial;
                return (empresa.toLowerCase().includes(filterValue));
            });

            return this.dataSourceTotal.data;
        }
    }

    onAutocompleteSelected(event: MatAutocompleteSelectedEvent): void {
        this.autocompletado = true;
    }

    buscarSupervisora(): number {
        const supervisoraValue = this.formGroup.controls.empresas.value;
        const supervisora = this.originalData.find(u => u.nombreRazonSocial === supervisoraValue);
        return supervisora.idSupervisora;
    }

    realizarAsignacion() {

        this.supervisora = new Supervisora();
        this.supervisora.idSupervisora = this.buscarSupervisora();

        let propCons = {
            propuestaTecnica: this.propuestaTecnica,
            supervisora: this.supervisora,
            participacion: 0
        }

        this.propuestaConsorcioService.guardarEmpresaConsorcio(propCons).subscribe(res => {

            this.empresaSeleccionada = "";
            if(res) {
                functionsAlert.questionSiNo('¿Desea agregar nueva empresa?').then((result) => {
                    
                    if(result.isConfirmed) {
                        if (this.primerRegistro) {
                            let firstPropCon = {
                                propuestaTecnica: this.propuestaTecnica,
                                supervisora: this.firstSupervisora,
                                participacion: 0
                            }

                            this.propuestaConsorcioService.guardarEmpresaConsorcio(firstPropCon).subscribe(res => {
                                this.primerRegistro = false;
                            });
                        }
                        else {
                            this.propuestaConsorcioService.obtenerEmpresasConsorcio(propCons.propuestaTecnica.idPropuestaTecnica, this.sector).subscribe(resp => {
                                this.empresasRegistradas = resp;
                            });
                        }
                    }
                    else {
                        if (this.primerRegistro) {
                            let firstPropCon = {
                                propuestaTecnica: this.propuestaTecnica,
                                supervisora: this.firstSupervisora,
                                participacion: 0
                            }

                            this.propuestaConsorcioService.guardarEmpresaConsorcio(firstPropCon).subscribe(res => {
                                this.primerRegistro = false;
                                this.closeModal();
                            });
                        }
                        else {
                            this.closeModal();
                        }
                    }
                })
            }
            else {
                this.closeModal();
            }
        });
    }
}
