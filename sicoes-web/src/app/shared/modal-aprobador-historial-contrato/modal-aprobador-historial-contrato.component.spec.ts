import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAprobadorHistorialContratoComponent } from './modal-aprobador-historial-contrato.component';

describe('ModalAprobadorHistorialContratoComponent', () => {
  let component: ModalAprobadorHistorialContratoComponent;
  let fixture: ComponentFixture<ModalAprobadorHistorialContratoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAprobadorHistorialContratoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAprobadorHistorialContratoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
