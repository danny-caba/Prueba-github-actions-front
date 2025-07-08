import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContratoDocumentosComponent } from './contrato-documentos.component';

describe('ContratoDocumentosComponent', () => {
  let component: ContratoDocumentosComponent;
  let fixture: ComponentFixture<ContratoDocumentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContratoDocumentosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContratoDocumentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
