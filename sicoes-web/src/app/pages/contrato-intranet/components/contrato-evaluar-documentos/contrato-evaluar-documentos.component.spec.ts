import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContratoEvaluarDocumentosComponent } from './contrato-evaluar-documentos.component';

describe('ContratoEvaluarDocumentosComponent', () => {
  let component: ContratoEvaluarDocumentosComponent;
  let fixture: ComponentFixture<ContratoEvaluarDocumentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContratoEvaluarDocumentosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContratoEvaluarDocumentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
