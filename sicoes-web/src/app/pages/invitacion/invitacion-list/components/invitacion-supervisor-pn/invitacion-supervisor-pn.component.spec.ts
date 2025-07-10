import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitacionSupervisorPnComponent } from './invitacion-supervisor-pn.component';

describe('InvitacionSupervisorPnComponent', () => {
  let component: InvitacionSupervisorPnComponent;
  let fixture: ComponentFixture<InvitacionSupervisorPnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvitacionSupervisorPnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvitacionSupervisorPnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
