import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Ubigeo } from 'src/app/interface/ubigeo.model';
import { UbigeoService } from 'src/app/service/ubigeo.service';
import { functions } from 'src/helpers/functions';

@Component({
  selector: 'vex-ubigeo-upd',
  templateUrl: './ubigeo-upd.component.html',
  styleUrls: ['./ubigeo-upd.component.scss']
})
export class UbigeoUpdComponent implements OnInit {

  @Input() parentForm = this.fb.group({
    departamento: [null as Ubigeo, Validators.required],
    provincia: [null as Ubigeo, Validators.required],
    distrito: [null as Ubigeo, Validators.required],
  });
  
  @Input() layout = 'column';
  @Input() value:any;
  @Input() editable:boolean = false;

  @Input() departamentos: Ubigeo[] = [];
  @Input() provincias: Ubigeo[] = [];
  @Input() distritos: Ubigeo[] = [];

  constructor(
    private _ubigeoService: UbigeoService,
    private fb: FormBuilder,
  ) { 

  }

  ngOnInit(): void {
    if(!this.editable){
      this.parentForm.disable();
    }
  }

  clear(){
    this.parentForm.reset()
    this.value = null;
    this.parentForm.controls.distrito.setValue(null);
    this.parentForm.controls.provincia.setValue(null);
    this.parentForm.controls.departamento.setValue(null);
  }

  onChangeDepartamento(codigo: string) {      
    this.provincias = null
    this.distritos = null 
    //this.parentForm.controls["provincia"].setValue(null)
    //this.parentForm.controls["distrito"].setValue(null)
    if(codigo!=undefined&&codigo!=""){
      this._ubigeoService.findProvinciaByDepartamento(codigo).subscribe(res => {
        this.provincias = res
      });
    }        
    
  }

  onChangeProvincia(codigo: string) {    
    this.distritos = null
    //this.parentForm.controls["distrito"].setValue(null)
    if(codigo!=undefined&&codigo!=""){
      this._ubigeoService.findDistritoByProvincia(codigo).subscribe(res => {
        this.distritos = res
      });
    }else{
      this.parentForm.controls["distrito"].setValue(null)
    }
  }

  setValue(value){
    this.value = value;
    this.putValue();
  }

  validarForm(){
    if (!this.parentForm.valid) {
      this.parentForm.markAllAsTouched();
      return true;
    }
    return false;
  }

  esValido(){
    this.parentForm.markAllAsTouched();

    if(!this.editable){
      return true;
    }
    
    return this.parentForm.valid;
  }  

  putValue(){
    if(this.value != undefined && this.value != null){
      if(functions.noEsVacio(this.value.codigoDepartamento)){
        
        let dep: Ubigeo = {
          codigo: this.value.codigoDepartamento,
          nombre: this.value.nombreDepartamento,
        };
        if(this.editable == false){
          this.departamentos?.push(dep);
        }
        this.parentForm.controls["departamento"].setValue(dep)  

      }
      if(functions.noEsVacio(this.value.codigoProvincia)){
        let pro: Ubigeo = {
          codigo: this.value.codigoProvincia,
          nombre: this.value.nombreProvincia,
        }
        if(this.editable == false){
          this.provincias?.push(pro);
        }
        this.parentForm.controls["provincia"].setValue(pro)
      }
      if(functions.noEsVacio(this.value.codigoDistrito)){
        let dis: Ubigeo = {
          codigo: this.value.codigoDistrito,
          nombre: this.value.nombreDistrito,
        };
        if(this.editable == false){
          this.distritos?.push(dis);
        }
        this.parentForm.controls["distrito"].setValue(dis)
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.putValue();
    if(this.editable == true){
      this.habilitarEventos()
      this.parentForm.enable();
    }
    if(this.editable == false){
      this.habilitarEventos()
      this.parentForm.disable();
    }
  }

  habilitarEventos(){
    this._ubigeoService.findAllDepartamento().subscribe(res => {
      this.departamentos = res
    })       
    this.parentForm.get('departamento').valueChanges.subscribe(value =>{     
      this.onChangeDepartamento(value?.codigo) 
    })     
    this.parentForm.get('provincia').valueChanges.subscribe(value =>{
      this.onChangeProvincia(value?.codigo) 
    })    
    this.parentForm.get('distrito').valueChanges.subscribe(value =>{
      this._ubigeoService.obtenerDistrito(value?.codigo) 
    })
  }

  getUbigeo(){
    try {
      const ubigeo={
        codigoDepartamento:this.parentForm.controls["departamento"].value?.codigo,
        nombreDepartamento:this.parentForm.controls["departamento"].value?.nombre,

        codigoProvincia:this.parentForm.controls["provincia"].value?.codigo,
        nombreProvincia:this.parentForm.controls["provincia"].value?.nombre,

        codigoDistrito:this.parentForm.controls["distrito"].value?.codigo,
        nombreDistrito:this.parentForm.controls["distrito"].value?.nombre,
      }
      return ubigeo;
      
    } catch (error) {

    }
  }

  compareCodigoUbigeo(a, b){
    return a?.codigo === b?.codigo;
  }

}
