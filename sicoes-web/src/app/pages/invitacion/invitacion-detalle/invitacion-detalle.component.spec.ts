import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitacionDetalleComponent } from './invitacion-detalle.component';

describe('InvitacionDetalleComponent', () => {
  let component: InvitacionDetalleComponent;
  let fixture: ComponentFixture<InvitacionDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvitacionDetalleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvitacionDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
