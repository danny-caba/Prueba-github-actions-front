import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContratoEvaluarDcosInicioReviewComponent } from './contrato-evaluar-dcos-inicio-review.component';

describe('ContratoEvaluarDcosInicioReviewComponent', () => {
  let component: ContratoEvaluarDcosInicioReviewComponent;
  let fixture: ComponentFixture<ContratoEvaluarDcosInicioReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContratoEvaluarDcosInicioReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContratoEvaluarDcosInicioReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
