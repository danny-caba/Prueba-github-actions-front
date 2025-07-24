import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutActaInicioComponent } from './layout-acta-inicio.component';

describe('LayoutActaInicioComponent', () => {
  let component: LayoutActaInicioComponent;
  let fixture: ComponentFixture<LayoutActaInicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LayoutActaInicioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutActaInicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
