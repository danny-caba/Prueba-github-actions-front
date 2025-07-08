import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-solicitud-list-atencion-solicitudes',
  templateUrl: './solicitud-list-atencion-solicitudes.component.html',
  styleUrls: ['./solicitud-list-atencion-solicitudes.component.scss']
})
export class SolicitudListAtencionSolicitudesComponent implements OnInit {
  selectedTab: string = 'atencion';

  constructor() { }

  ngOnInit(): void {
  }
}