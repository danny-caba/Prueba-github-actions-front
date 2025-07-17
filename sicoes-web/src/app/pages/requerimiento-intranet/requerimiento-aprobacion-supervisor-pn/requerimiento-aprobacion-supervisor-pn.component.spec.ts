import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequerimientoAprobacionSupervisorPnComponent } from './requerimiento-aprobacion-supervisor-pn.component';

describe('RequerimientoAprobacionSupervisorPnComponent', () => {
  let component: RequerimientoAprobacionSupervisorPnComponent;
  let fixture: ComponentFixture<RequerimientoAprobacionSupervisorPnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequerimientoAprobacionSupervisorPnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequerimientoAprobacionSupervisorPnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
