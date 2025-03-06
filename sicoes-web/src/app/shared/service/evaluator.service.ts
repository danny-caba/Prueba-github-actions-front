import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EvaluatorService {


  constructor(
  ) { }

  evaluarFechaPorEtapa(fechaInicio: string, fechaFin: string): string {
    const dateNow = new Date();
    const hoy = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate());

    const [diaInicio, mesInicio, anioInicio] = fechaInicio.split('/');
    const [diaFin, mesFin, anioFin] = fechaFin.split('/');

    const fechaInicioDate = new Date(`${mesInicio}/${diaInicio}/${anioInicio}`);
    const fechaFinDate = new Date(`${mesFin}/${diaFin}/${anioFin}`);

    if (isNaN(fechaInicioDate.getTime()) || isNaN(fechaFinDate.getTime())) {
      console.error('Fechas inválidas:', { fechaInicio, fechaFin });
      return 'Fecha inválida';
    }

    if (hoy < fechaInicioDate) {
      return 'No iniciado';
    } else if (hoy > fechaFinDate) {
      return 'Concluído';
    } else {
      return 'En curso';
    }
  }
  
}
