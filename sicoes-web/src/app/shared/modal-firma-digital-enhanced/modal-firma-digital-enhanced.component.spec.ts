import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../material.module';

import { ModalFirmaDigitalEnhancedComponent } from './modal-firma-digital-enhanced.component';

describe('ModalFirmaDigitalEnhancedComponent', () => {
  let component: ModalFirmaDigitalEnhancedComponent;
  let fixture: ComponentFixture<ModalFirmaDigitalEnhancedComponent>;

  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };

  const mockData = {
    archivos: [
      { id: '123', nombre: 'Documento Test' }
    ],
    parametros: {
      action: 'test-action',
      loginUsuario: 'test-user',
      passwordUsuario: 'test-pass'
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalFirmaDigitalEnhancedComponent],
      imports: [BrowserAnimationsModule, MaterialModule],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockData }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalFirmaDigitalEnhancedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct data', () => {
    expect(component.archivosParaFirmar.length).toBe(1);
    expect(component.archivosParaFirmar[0].id).toBe('123');
    expect(component.parametrosFirma.action).toBe('test-action');
  });

  it('should handle empty archives', () => {
    component.data.archivos = [];
    component.procesarArchivos();
    expect(component.estado).toBe('error');
  });
});