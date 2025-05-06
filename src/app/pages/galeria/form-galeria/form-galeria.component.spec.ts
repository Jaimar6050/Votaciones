import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormGaleriaComponent } from './form-galeria.component';

describe('FormGaleriaComponent', () => {
  let component: FormGaleriaComponent;
  let fixture: ComponentFixture<FormGaleriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormGaleriaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormGaleriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
