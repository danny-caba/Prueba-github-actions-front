import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRequisitoComponent } from './modal-requisito.component';

describe('ModalRequisitoComponent', () => {
  let component: ModalRequisitoComponent;
  let fixture: ComponentFixture<ModalRequisitoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalRequisitoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalRequisitoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
