import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequerimientoEditarContratoComponent } from './requerimiento-editar-contrato.component';

describe('RequerimientoEditarContratoComponent', () => {
  let component: RequerimientoEditarContratoComponent;
  let fixture: ComponentFixture<RequerimientoEditarContratoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequerimientoEditarContratoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequerimientoEditarContratoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
