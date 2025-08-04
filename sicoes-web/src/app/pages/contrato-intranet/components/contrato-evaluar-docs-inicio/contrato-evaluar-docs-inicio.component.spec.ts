import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContratoEvaluarDocsInicioComponent } from './contrato-evaluar-docs-inicio.component';

describe('ContratoEvaluarDocsInicioComponent', () => {
  let component: ContratoEvaluarDocsInicioComponent;
  let fixture: ComponentFixture<ContratoEvaluarDocsInicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContratoEvaluarDocsInicioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContratoEvaluarDocsInicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
