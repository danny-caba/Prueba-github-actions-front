import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequerimientoDocumentoReviewComponent } from './requerimiento-documento-review.component';

describe('RequerimientoDocumentoReviewComponent', () => {
  let component: RequerimientoDocumentoReviewComponent;
  let fixture: ComponentFixture<RequerimientoDocumentoReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequerimientoDocumentoReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequerimientoDocumentoReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
