import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandejaAsignacionComponent } from './bandeja-asignacion.component';

describe('BandejaAsignacionComponent', () => {
  let component: BandejaAsignacionComponent;
  let fixture: ComponentFixture<BandejaAsignacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BandejaAsignacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BandejaAsignacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
