import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandejaContratosProcesarComponent } from './bandeja-contratos-procesar.component';

describe('BandejaContratosProcesarComponent', () => {
  let component: BandejaContratosProcesarComponent;
  let fixture: ComponentFixture<BandejaContratosProcesarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BandejaContratosProcesarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BandejaContratosProcesarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
