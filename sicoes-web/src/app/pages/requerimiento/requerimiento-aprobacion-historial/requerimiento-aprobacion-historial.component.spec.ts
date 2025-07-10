import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequerimientoAprobacionHistorialComponent } from './requerimiento-aprobacion-historial.component';

describe('RequerimientoAprobacionHistorialComponent', () => {
  let component: RequerimientoAprobacionHistorialComponent;
  let fixture: ComponentFixture<RequerimientoAprobacionHistorialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequerimientoAprobacionHistorialComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequerimientoAprobacionHistorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
